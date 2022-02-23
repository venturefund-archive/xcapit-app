import { MenuItem } from './menu-item.interface';

export interface MenuCategory {
  category_title: string;
  showCategory?: boolean;
  id?: string;
  icon: string;
  items?: MenuItem[];
  route?: string;
  name?: string;
}
