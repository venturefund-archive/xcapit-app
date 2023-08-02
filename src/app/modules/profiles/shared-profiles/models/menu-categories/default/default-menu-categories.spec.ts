import { MenuCategoryDataRepo } from '../../menu-category-data-repo/menu-category-data-repo';
import { rawMenuCategories } from '../../menu-category.raw';
import { MenuItemDataRepo } from '../../menu-item-data-repo/menu-item-data-repo';
import { rawMenuItems } from '../../menu-item/menu-items.raw';
import { MenuItems } from '../../menu-items/menu-items';
import { DefaultMenuCategories } from './default-menu-categories';

fdescribe('DefaultMenuCategories', () => {
  let menuCategories: DefaultMenuCategories;

  beforeEach(() => {
    menuCategories = new DefaultMenuCategories(
      new MenuCategoryDataRepo(rawMenuCategories),
      new MenuItems(new MenuItemDataRepo(rawMenuItems))
    );
  });

  it('new', () => {
    expect(menuCategories).toBeTruthy();
  });

  it('all', () => {
    expect(menuCategories.all().length).toEqual(2);
  });
});
