import { MenuCategory } from '../menu-category.inteface';
import { RawMenuCategory } from '../../raw-menu-category';
import { rawMenuCategoryHelp } from '../../menu-category.raw';

export class FakeMenuCategory implements MenuCategory {
  constructor(private _aRawMenuCategory: RawMenuCategory = rawMenuCategoryHelp) {}

  name(): string {
    return this._aRawMenuCategory.name;
  }

  hide(): MenuCategory {
    return new FakeMenuCategory(this._aRawMenuCategory);
  }

  show(): MenuCategory {
    return new FakeMenuCategory(this._aRawMenuCategory);
  }

  setWalletConnectStatus(_connected: boolean): MenuCategory {
    return new FakeMenuCategory(this._aRawMenuCategory);
  }

  json(): RawMenuCategory {
    return this._aRawMenuCategory;
  }

  position(): number {
    return this._aRawMenuCategory.position;
  }
}
