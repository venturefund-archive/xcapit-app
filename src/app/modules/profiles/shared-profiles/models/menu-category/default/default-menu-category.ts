import { MenuItem } from '../../menu-item/menu-item';
import { MenuItems } from '../../menu-items/menu-items';
import { RawMenuCategory } from '../../raw-menu-category';

export class DefaultMenuCategory {
  constructor(private _aRawMenuCategory: RawMenuCategory, private _menuItems: MenuItems) {}

  json(): RawMenuCategory {
    return { ...this._aRawMenuCategory, items: this._items().map((item) => item.json()) };
  }

  private _items(): MenuItem[] {
    return this._menuItems.byCategory(this._aRawMenuCategory.name);
  }
}
