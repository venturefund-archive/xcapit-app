import { rawMenuCategoryHelp } from '../../menu-category.raw';
import { MenuItemDataRepo } from '../../menu-item-data-repo/menu-item-data-repo';
import { rawMenuItemCommunity, rawMenuItemSupport, rawMenuItems } from '../../menu-item/menu-items.raw';
import { MenuItems } from '../../menu-items/menu-items';
import { DefaultMenuCategory } from './default-menu-category';

fdescribe('DefaultMenuCategory', () => {
  let menuCategory: DefaultMenuCategory;

  beforeEach(() => {
    menuCategory = new DefaultMenuCategory(rawMenuCategoryHelp, new MenuItems(new MenuItemDataRepo(rawMenuItems)));
  });

  it('new', () => {
    expect(menuCategory).toBeTruthy();
  });

  it('json', () => {
    expect(menuCategory.json()).toEqual({ ...rawMenuCategoryHelp, items: [rawMenuItemSupport, rawMenuItemCommunity] });
  });
});
