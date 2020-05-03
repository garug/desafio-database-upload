import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const repository = getCustomRepository(TransactionsRepository);
    const result = await repository.delete(id);
    if (!result || result.affected === 0) {
      throw new AppError('Transaction not found', 404);
    }
  }
}

export default DeleteTransactionService;
