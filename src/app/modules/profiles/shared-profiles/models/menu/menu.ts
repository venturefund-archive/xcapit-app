import { DefaultMenuCategories } from '../menu-categories/default/default-menu-categories';
import { MenuCategories } from '../menu-categories/menu-categories.interface';
import { RawMenuCategory } from '../raw-menu-category';

export class Menu {
  private _cachedRawMenuCategories: RawMenuCategory[];

  constructor(private readonly _menuCategories: MenuCategories = new DefaultMenuCategories()) {}

  json(): RawMenuCategory[] {
    if (!this._cachedRawMenuCategories) {
      this._cachedRawMenuCategories = structuredClone(this._menuCategories.all().map((category) => category.json()));
    }
    return this._cachedRawMenuCategories;
  }

  hide(_aCategoryName: string, _anItemName: string = null): Menu {
    return new Menu(this._menuCategories.hide(_aCategoryName, _anItemName));
  }

  show(_aCategoryName: string, _anItemName: string = null): Menu {
    return new Menu(this._menuCategories.show(_aCategoryName, _anItemName));
  }

  withWalletConnectStatus(_connected: boolean) {
    return new Menu(this._menuCategories.withWalletConnectStatus(_connected));
  }
}
