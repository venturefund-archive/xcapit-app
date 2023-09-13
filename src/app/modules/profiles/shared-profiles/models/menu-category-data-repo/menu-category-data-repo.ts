import { RawMenuCategory } from '../raw-menu-category';
import { RAW_MENU_CATEGORIES } from './raw-menu-categories';
import { structuredClone } from '../../../../../shared/utils/structured-clone';

export class MenuCategoryDataRepo {
  constructor(private readonly _rawMenuCategories: RawMenuCategory[] = RAW_MENU_CATEGORIES) {}

  all(): RawMenuCategory[] {
    return structuredClone(this._rawMenuCategories.sort((a, b) => a.position - b.position));
  }
}
