import { MenuCategory } from '../menu-category/menu-category.inteface';

export interface MenuCategories {
  all: () => MenuCategory[];
}
