import { MenuItem } from '../menu-item/menu-item';

export interface MenuItems {
  byCategory: (_aCategoryName: string) => MenuItem[];
  show: (_aCategoryName: string, _anItemName?: string) => MenuItems;
  hide: (_aCategoryName: string, _anItemName?: string) => MenuItems;
}
