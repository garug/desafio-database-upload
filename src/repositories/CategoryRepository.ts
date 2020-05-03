import { EntityRepository, Repository, In } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoryRepository extends Repository<Category> {
  public async getCategory(category: string): Promise<Category> {
    const savedCategory = await this.findOne({
      where: { title: category },
    });

    if (savedCategory) {
      return savedCategory;
    } else {
      const categoryToSave = this.create({
        title: category,
      });
      return this.save(categoryToSave);
    }
  }

  public async getCategories(categories: string[]): Promise<Category[]> {
    const uniques = categories.filter(
      (category, index) => categories.indexOf(category) === index,
    );
    const savedCategories = await this.find({
      where: { title: In(uniques) },
    });
    const categoriesToSave = uniques
      .filter(cat => !savedCategories.some(e => e.title === cat))
      .map(title => this.create({ title }));
    await this.save(categoriesToSave);
    return [...savedCategories, ...categoriesToSave];
  }
}

export default CategoryRepository;
