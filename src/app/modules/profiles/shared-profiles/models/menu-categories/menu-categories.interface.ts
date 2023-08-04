import { MenuCategory } from '../menu-category/menu-category.inteface';

export interface MenuCategories {
  all: () => MenuCategory[];
  hide: (_aCategoryName: string, _anItemName?: string) => MenuCategories;
  show: (_aCategoryName: string, _anItemName?: string) => MenuCategories;
  withWalletConnectStatus: (_connected: boolean) => MenuCategories;
}
