import { MenuItem } from '../../menu-item/menu-item';
import { MenuItems } from '../../menu-items/menu-items.interface';
import { RawMenuCategory } from '../../raw-menu-category';
import { MenuCategory } from '../menu-category.interface';

export class DefaultMenuCategory implements MenuCategory {
  constructor(private _aRawMenuCategory: RawMenuCategory, private _menuItems: MenuItems) {}

  json(): RawMenuCategory {
    return { ...this._aRawMenuCategory, items: this._items().map((item) => item.json()) };
  }

  name(): string {
    return this._aRawMenuCategory.name;
  }

  position(): number {
    return this._aRawMenuCategory.position;
  }

  hide(): MenuCategory {
    return new DefaultMenuCategory({ ...this._aRawMenuCategory, visible: false }, this._menuItems);
  }

  show(): MenuCategory {
    return new DefaultMenuCategory({ ...this._aRawMenuCategory, visible: true }, this._menuItems);
  }

  setWalletConnectStatus(_connected: boolean): MenuCategory {
    return new DefaultMenuCategory(
      {
        ...this._aRawMenuCategory,
        connected: _connected,
        legend: _connected
          ? 'profiles.user_profile_menu.connected_walletconnect'
          : 'profiles.user_profile_menu.disconnected_walletconnect',
      },
      this._menuItems
    );
  }

  private _items(): MenuItem[] {
    return this._menuItems.byCategory(this._aRawMenuCategory.name);
  }
}
