import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  const [balance, transactions] = await Promise.all([
    repository.getBalance(),
    repository.find(),
  ]);
  return response.send({ balance, transactions });
});

transactionsRouter.post('/', async (request, response) => {
  const service = new CreateTransactionService();
  const { title, value, type, category } = request.body;
  const transaction = await service.execute({ title, value, type, category });
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const service = new DeleteTransactionService();
  const { id } = request.params;
  await service.execute(id);
  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const service = new ImportTransactionsService();
    const transactions = await service.execute(request.file.path);

    return response.json(transactions);
  },
);

export default transactionsRouter;
