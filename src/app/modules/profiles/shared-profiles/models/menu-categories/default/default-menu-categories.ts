import { MenuCategoryDataRepo } from '../../menu-category-data-repo/menu-category-data-repo';
import { DefaultMenuCategory } from '../../menu-category/default/default-menu-category';
import { DefaultMenuItems } from '../../menu-items/default/default-menu-items';
import { MenuCategories } from '../menu-categories.interface';
import { MenuCategory } from '../../menu-category/menu-category.inteface';
import { MenuItems } from '../../menu-items/menu-items.interface';

export class DefaultMenuCategories implements MenuCategories {
  private _cachedMenuCategories: MenuCategory[];
  constructor(
    private _aMenuCategoryDataRepo: MenuCategoryDataRepo = new MenuCategoryDataRepo(),
    private _menuItems: MenuItems = new DefaultMenuItems()
  ) {}

  all(): MenuCategory[] {
    if (!this._cachedMenuCategories) {
      this._cachedMenuCategories = this._aMenuCategoryDataRepo
        .all()
        .map((rawMenuCategory) => new DefaultMenuCategory(rawMenuCategory, this._menuItems));
    }
    return this._cachedMenuCategories;
  }

  hide(_aCategoryName: string, _anItemName: string = null): MenuCategories {
    let result: MenuCategories;
    if (_anItemName) {
      result = new DefaultMenuCategories(
        this._aMenuCategoryDataRepo,
        this._menuItems.hide(_aCategoryName, _anItemName)
      );
    } else {
      this._updateMenuCategory(this._byName(_aCategoryName).hide());
      result = new DefaultMenuCategories(
        new MenuCategoryDataRepo(this.all().map((category) => category.json())),
        this._menuItems
      );
    }
    return result;
  }

  show(_aCategoryName: string, _anItemName: string = null): MenuCategories {
    let result: MenuCategories;
    if (_anItemName) {
      result = new DefaultMenuCategories(
        this._aMenuCategoryDataRepo,
        this._menuItems.show(_aCategoryName, _anItemName)
      );
    } else {
      this._updateMenuCategory(this._byName(_aCategoryName).show());
      result = new DefaultMenuCategories(
        new MenuCategoryDataRepo(this.all().map((category) => category.json())),
        this._menuItems
      );
    }
    return result;
  }

  withWalletConnectStatus(_connected: boolean): MenuCategories {
    this._updateMenuCategory(this._byName('WalletConnect').setWalletConnectStatus(_connected));
    return new DefaultMenuCategories(
      new MenuCategoryDataRepo(this.all().map((category) => category.json())),
      this._menuItems
    );
  }

  private _byName(_aCategoryName: string): MenuCategory {
    return this.all().find((category) => category.name() === _aCategoryName);
  }

  private _updateMenuCategory(menuCategory: MenuCategory) {
    this.all()[menuCategory.position() - 1] = menuCategory;
  }
}
