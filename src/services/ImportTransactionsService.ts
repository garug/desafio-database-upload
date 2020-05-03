import csvParse from 'csv-parse';
import fs from 'fs';
import { getCustomRepository, getRepository } from 'typeorm';

import CategoryRepository from '../repositories/CategoryRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

class ImportTransactionsService {
  async execute(path: string): Promise<Transaction[]> {
    const categoryRepository = getCustomRepository(CategoryRepository);
    const repository = getRepository(Transaction);
    const stream = fs.createReadStream(path);
    const parse = csvParse({
      from_line: 2,
    });
    const parsedCSV = stream.pipe(parse);
    const transactions: Transaction[] = [];
    const categories: string[] = [];

    parsedCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      const transaction = repository.create({
        title,
        type,
        value,
        category_id: category,
      });
      transactions.push(transaction);
      categories.push(category);
    });

    await new Promise(resolve => parsedCSV.on('end', resolve));
    const usedCategories = await categoryRepository.getCategories(categories);
    transactions.forEach(trans => {
      const savedCat = usedCategories.find(
        savedCat => savedCat.title === trans.category_id,
      );
      trans.category_id = savedCat?.id || trans.category_id;
    });
    await repository.save(transactions);
    return transactions;
  }
}

export default ImportTransactionsService;
