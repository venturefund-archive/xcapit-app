import { RawMenuItem } from './raw-menu-item';

export class MenuItem {
  constructor(private _aRawItemMenu: RawMenuItem) {}

  name(): string {
    return this._aRawItemMenu.name;
  }

  categoryName(): string {
    return this._aRawItemMenu.categoryName;
  }

  json(): RawMenuItem {
    return this._aRawItemMenu;
  }

  position(): number {
    return this._aRawItemMenu.position;
  }

  hide(): MenuItem {
    return new MenuItem({ ...this._aRawItemMenu, visible: false });
  }

  show(): MenuItem {
    return new MenuItem({ ...this._aRawItemMenu, visible: true });
  }
}
