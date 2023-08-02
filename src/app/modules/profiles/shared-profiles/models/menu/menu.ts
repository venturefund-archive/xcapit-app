import { MenuCategories } from '../menu-categories/menu-categories.interface';
import { DefaultMenuCategories } from '../menu-categories/default/default-menu-categories';
import { RawMenuCategory } from '../raw-menu-category';

export class Menu {
  private _cachedRawMenuCategories: RawMenuCategory[];
  constructor(private readonly _menuCategories: MenuCategories = new DefaultMenuCategories()) {}

  json(): RawMenuCategory[] {
    if (!this._cachedRawMenuCategories) {
      this._cachedRawMenuCategories = structuredClone(this._menuCategories.all().map((category) => category.json()));
    }
    return this._cachedRawMenuCategories;
  }

  hide(aCategoryName: string, anItemName: string): void {
    this._toggle(aCategoryName, anItemName, false);
  }

  hideCategory(aCategoryName: string): void {
    this._toggleCategory(aCategoryName, false);
  }

  show(aCategoryName: string, anItemName: string): void {
    this._toggle(aCategoryName, anItemName, true);
  }

  showCategory(aCategoryName: string): void {
    this._toggleCategory(aCategoryName, true);
  }

  private _toggleCategory(aCategoryName: string, visible: boolean) {
    this._categoryByName(aCategoryName).visible = visible;
  }

  private _toggle(aCategoryName: string, anItemName: string, visible: boolean) {
    this._categoryByName(aCategoryName).items.find((menuItem) => menuItem.name === anItemName).visible = visible;
  }

  private _categoryByName(aCategoryName: string): RawMenuCategory {
    return this.json().find((menuCategory) => menuCategory.name === aCategoryName);
  }
}
