// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import { getRepository } from 'typeorm';

interface Entry {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Entry): Promise<Transaction> {
    const repository = getRepository(Transaction);
    const category_id = (await this.getCategory(category)).id;

    const transaction = repository.create({
      title,
      value,
      type,
      category_id,
    });
    return repository.save(transaction);
  }

  private async getCategory(category: string): Promise<Category> {
    const repository = getRepository(Category);

    const savedCategory = await repository
      .createQueryBuilder('category')
      .where('category.title = :title', { title: category })
      .getOne();

    if (savedCategory) {
      return savedCategory;
    } else {
      const categoryToSave = repository.create({
        title: category,
      });
      return repository.save(categoryToSave);
    }
  }
}

export default CreateTransactionService;
