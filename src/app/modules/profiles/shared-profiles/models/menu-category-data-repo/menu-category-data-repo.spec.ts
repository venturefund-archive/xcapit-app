import { rawMenuCategories } from '../menu-category.raw';
import { MenuCategoryDataRepo } from './menu-category-data-repo';

fdescribe('MenuCategoryDataRepo', () => {
  let menuCategoryDataRepo: MenuCategoryDataRepo;

  beforeEach(() => {
    menuCategoryDataRepo = new MenuCategoryDataRepo(rawMenuCategories);
  });

  it('new', () => {
    expect(menuCategoryDataRepo).toBeTruthy();
  });

  it('all', () => {
    expect(menuCategoryDataRepo.all()).toEqual(rawMenuCategories);
  });
});
