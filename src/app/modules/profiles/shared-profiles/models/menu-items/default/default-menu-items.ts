import { MenuItemDataRepo } from '../../menu-item-data-repo/menu-item-data-repo';
import { MenuItem } from '../../menu-item/menu-item';
import { MenuItems } from '../menu-items.interface';

export class DefaultMenuItems implements MenuItems {
  constructor(
    private readonly _aDataRepo: MenuItemDataRepo = new MenuItemDataRepo(),
    private _cachedMenuItems: Map<string, MenuItem[]> = new Map()
  ) {}

  byCategory(aCategory: string): MenuItem[] {
    if (!this._cachedMenuItems.has(aCategory)) {
      this._cachedMenuItems.set(
        aCategory,
        this._aDataRepo.byCategory(aCategory).map((rawMenuItem) => new MenuItem(rawMenuItem))
      );
    }
    return this._cachedMenuItems.get(aCategory);
  }

  hide(_aCategoryName: string, _anItemName: string): MenuItems {
    const menuItem = this.byCategory(_aCategoryName)
      .find((item) => item.name() === _anItemName)
      .hide();
    this.byCategory(_aCategoryName)[menuItem.position() - 1] = menuItem;
    return new DefaultMenuItems(this._aDataRepo, this._cachedMenuItems);
  }

  show(_aCategoryName: string, _anItemName: string): MenuItems {
    const menuItem = this.byCategory(_aCategoryName)
      .find((item) => item.name() === _anItemName)
      .show();
    this.byCategory(_aCategoryName)[menuItem.position() - 1] = menuItem;
    return new DefaultMenuItems(this._aDataRepo, this._cachedMenuItems);
  }
}
