import { MenuCategory } from '../menu-category.inteface';
import { RawMenuCategory } from '../../raw-menu-category';
import { rawMenuCategoryHelp } from '../../menu-category.raw';

export class FakeMenuCategory implements MenuCategory {
  constructor(private _aRawMenuCategory: RawMenuCategory = rawMenuCategoryHelp) {}

  json(): RawMenuCategory {
    return this._aRawMenuCategory;
  }
}
