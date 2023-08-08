import { RawMenuItem } from '../menu-item/raw-menu-item';
import { RAW_MENU_ITEMS } from './menu-items.raw';

export class MenuItemDataRepo {
  constructor(private readonly _rawMenuItems: RawMenuItem[] = RAW_MENU_ITEMS) {}

  byCategory(aCategory: string): RawMenuItem[] {
    return this._rawMenuItems
      .filter((rawMenuItem) => rawMenuItem.categoryName === aCategory)
      .sort((a, b) => a.position - b.position);
  }
}
