import { MenuCategoryDataRepo } from '../../menu-category-data-repo/menu-category-data-repo';
import { DefaultMenuCategory } from '../../menu-category/default/default-menu-category';
import { MenuItems } from '../../menu-items/menu-items';
import { MenuCategories } from '../menu-categories.interface';

export class DefaultMenuCategories implements MenuCategories {
  constructor(
    private _aMenuCategoryDataRepo: MenuCategoryDataRepo = new MenuCategoryDataRepo(),
    private _menuItems: MenuItems = new MenuItems()
  ) {}

  all(): DefaultMenuCategory[] {
    return this._aMenuCategoryDataRepo
      .all()
      .map((rawMenuCategory) => new DefaultMenuCategory(rawMenuCategory, this._menuItems));
  }
}
