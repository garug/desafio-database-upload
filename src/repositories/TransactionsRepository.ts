import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const sumValue = (previousValue: number, currentTransaction: Transaction) =>
      (previousValue += Number(currentTransaction.value));

    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce(sumValue, 0);
    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce(sumValue, 0);
    return { income, outcome, total: income - outcome };
  }
}

export default TransactionsRepository;
