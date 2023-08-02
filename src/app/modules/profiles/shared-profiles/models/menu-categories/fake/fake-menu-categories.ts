import { MenuCategory } from '../../menu-category/menu-category.inteface';
import { MenuCategories } from '../menu-categories.interface';

export class FakeMenuCategories implements MenuCategories {
  constructor(private _allReturn: MenuCategory[] = []) {}
  all(): MenuCategory[] {
    return this._allReturn;
  }
}
