import { MenuItemDataRepo } from '../menu-item-data-repo/menu-item-data-repo';
import { MenuItem } from '../menu-item/menu-item';

export class MenuItems {
  constructor(private readonly _aDataRepo: MenuItemDataRepo = new MenuItemDataRepo()) {}

  byCategory(aCategory: string): MenuItem[] {
    return this._aDataRepo.byCategory(aCategory).map((rawMenuItem) => new MenuItem(rawMenuItem));
  }
}
