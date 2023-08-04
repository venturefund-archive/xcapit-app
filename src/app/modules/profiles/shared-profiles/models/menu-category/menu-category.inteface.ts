import { RawMenuCategory } from '../raw-menu-category';

export interface MenuCategory {
  json: () => RawMenuCategory;
  name: () => string;
  hide: () => MenuCategory;
  show: () => MenuCategory;
  setWalletConnectStatus: (_connected: boolean) => MenuCategory;
  position: () => number;
}
