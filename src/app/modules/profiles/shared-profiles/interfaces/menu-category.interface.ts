import { MenuItem } from './menu-item.interface';

export interface MenuCategory {
  category_title: string;
  icon: string;
  items?: MenuItem[];
  route?: string;
  name?: string;
}
