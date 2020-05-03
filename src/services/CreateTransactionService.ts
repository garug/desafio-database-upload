// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import CategoryRepository from '../repositories/CategoryRepository';

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
    const repository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);
    const balance = await repository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('You not have this amount');
    }

    const transaction = repository.create({
      title,
      value,
      type,
      category_id: (await categoryRepository.getCategory(category)).id,
    });

    return repository.save(transaction);
  }
}

export default CreateTransactionService;
