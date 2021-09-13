import { Request, Response } from 'express';
import { ProductRepository } from '../../db';

const createProductService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { displayName, categoryId, totalRating, price } = req.body;
    await ProductRepository.createProduct({ displayName, totalRating, price }, categoryId);
    res.send('Product created successfully');
  } catch (e) {
    res.send(e.message);
  }
};

export default createProductService;