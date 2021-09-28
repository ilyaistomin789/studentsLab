import IProductRepository from './interfaces/productRepository.interface';
import { IProduct } from './interfaces/product.interface';
import ProductTypegooseRepository from './repositories/productTypegooseRepository';
import ProductTypeOrmRepository from './repositories/productTypeOrmRepository';
import ICategoryRepository from './interfaces/categoryRepository.interface';
import { ICategory } from './interfaces/category.interface';
import CategoryTypeOrmRepository from './repositories/categoryTypeOrmRepository';
import CategoryTypegooseRepository from './repositories/categoryTypegooseRepository';
import mongoose from 'mongoose';
import { createConnection } from 'typeorm';
import { postgreConfig } from './config/config';
import { DB_HOST, MONGO_PORT, DB_DATABASE_NAME } from '../config/config';
import './mongo/services/logger';
import { IAccountRepository } from './interfaces/accountRepository.interface';
import { IAccount } from './interfaces/account.interface';
import AccountTypegooseRepository from './repositories/accountTypegooseRepository';
import AccountTypeOrmRepository from './repositories/accountTypeOrmRepository';
import { IUserRatingsRepository } from './interfaces/userRatingsRepository.interface';
import UserRatingsTypegooseRepository from './repositories/userRatingsTypegooseRepository';
import UserRatingsTypeOrmRepository from './repositories/userRatingsTypeOrmRepository';
import IOrderListRepository from './interfaces/orderListRepository.interface';
import OrderListTypeOrmRepository from './repositories/orderListTypeOrmRepository';
import OrderListTypegooseRepository from './repositories/orderListTypegooseRepository';
let ProductRepository: IProductRepository<IProduct>;
let CategoryRepository: ICategoryRepository<ICategory>;
let AccountRepository: IAccountRepository<IAccount>;
let UserRatingsRepository: IUserRatingsRepository;
let OrderListRepository: IOrderListRepository;

export const run = async (): Promise<void> => {
  try {
    if (process.env.DB === 'mongo') {
      await mongoose.connect(`mongodb://${DB_HOST}:${MONGO_PORT}/${DB_DATABASE_NAME}`);
      ProductRepository = new ProductTypegooseRepository();
      CategoryRepository = new CategoryTypegooseRepository();
      AccountRepository = new AccountTypegooseRepository();
      UserRatingsRepository = new UserRatingsTypegooseRepository();
      OrderListRepository = new OrderListTypegooseRepository();
    } else if (process.env.DB === 'pg') {
      await createConnection(postgreConfig);
      ProductRepository = new ProductTypeOrmRepository();
      CategoryRepository = new CategoryTypeOrmRepository();
      AccountRepository = new AccountTypeOrmRepository();
      UserRatingsRepository = new UserRatingsTypeOrmRepository();
      OrderListRepository = new OrderListTypeOrmRepository();
    }
  } catch (e) {
    console.log(e.message);
  }
};

export { ProductRepository, CategoryRepository, AccountRepository, UserRatingsRepository, OrderListRepository };
