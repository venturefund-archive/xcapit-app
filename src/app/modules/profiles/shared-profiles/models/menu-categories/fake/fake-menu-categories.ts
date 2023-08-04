import { MenuCategory } from '../../menu-category/menu-category.inteface';
import { MenuCategories } from '../menu-categories.interface';

export class FakeMenuCategories implements MenuCategories {
  constructor(private _allReturn: MenuCategory[] = []) {}
  all(): MenuCategory[] {
    return this._allReturn;
  }

  hide(_aCategoryName: string, _anItemName: string = null): MenuCategories {
    return new FakeMenuCategories();
  }

  show(_aCategoryName: string, _anItemName: string = null): MenuCategories {
    return new FakeMenuCategories();
  }

  withWalletConnectStatus(_connected: boolean): MenuCategories {
    return new FakeMenuCategories();
  }
}
