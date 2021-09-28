import { IUserRatingsRepository } from '../interfaces/userRatingsRepository.interface';
import { IUserRatingsDto, IUserRatingsMongo } from '../interfaces/userRatings.interface';
import { DocumentType, getModelForClass } from '@typegoose/typegoose';
import Product from '../mongo/models/product';
import { IProduct } from '../interfaces/product.interface';
import mongoose from 'mongoose';
import { sendLastRatings } from '../../utils/socket-io';

export default class UserRatingsTypegooseRepository implements IUserRatingsRepository {
  private productModel = getModelForClass(Product);
  public async addUserRating(data: IUserRatingsDto): Promise<void> {
    const accountObjId = new mongoose.mongo.ObjectId(data.account);
    const product: DocumentType<IProduct> = await this.productModel.findById(data.product);
    const userRatingsExists = product.ratings.some((rating) => `${rating.account}` === data.account);
    if (!userRatingsExists) {
      product.ratings.push({ account: accountObjId, rating: data.rating, comments: data.comments });
    } else {
      const index = product.ratings.findIndex((rating) => `${rating.account}` === data.account);
      product.ratings[index].rating = data.rating;
      product.ratings[index].comments = data.comments;
    }
    const sum: number = product.ratings.reduce((accum, currentValue) => accum + currentValue.rating, 0);
    product.totalRating = sum / product.ratings.length;

    await this.productModel.findOneAndUpdate(
      { _id: product._id },
      { $set: { totalRating: product.totalRating, ratings: product.ratings } }
    );
    sendLastRatings(await this.productModel.find().limit(10).sort('createdAt').lean());
  }
}
