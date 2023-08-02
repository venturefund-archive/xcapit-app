import { RawMenuCategory } from '../raw-menu-category';

export interface MenuCategory {
  json: () => RawMenuCategory;
}
