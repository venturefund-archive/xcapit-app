import { rawMenuCategoryHelp, rawMenuCategoryWalletConnect } from '../../menu-category.raw';
import { MenuItemDataRepo } from '../../menu-item-data-repo/menu-item-data-repo';
import { rawMenuItemCommunity, rawMenuItemSupport, rawMenuItems } from '../../menu-item/menu-items.raw';
import { DefaultMenuItems } from '../../menu-items/default/default-menu-items';
import { DefaultMenuCategory } from './default-menu-category';

describe('DefaultMenuCategory', () => {
  let menuCategory: DefaultMenuCategory;

  const _walletConnectMenuCategory = () =>
    new DefaultMenuCategory(rawMenuCategoryWalletConnect, new DefaultMenuItems(new MenuItemDataRepo([])));

  beforeEach(() => {
    menuCategory = new DefaultMenuCategory(
      rawMenuCategoryHelp,
      new DefaultMenuItems(new MenuItemDataRepo(rawMenuItems))
    );
  });

  it('new', () => {
    expect(menuCategory).toBeTruthy();
  });

  it('json', () => {
    expect(menuCategory.json()).toEqual({ ...rawMenuCategoryHelp, items: [rawMenuItemSupport, rawMenuItemCommunity] });
  });

  it('name', () => {
    expect(menuCategory.name()).toEqual(rawMenuCategoryHelp.name);
  });

  it('hide', () => {
    expect(menuCategory.hide().json().visible).toBeFalse();
  });

  it('setWalletConnectStatus true', () => {
    const tplCategory = _walletConnectMenuCategory().setWalletConnectStatus(true).json();
    expect(tplCategory.connected).toBeTrue();
    expect(tplCategory.legend).toEqual('profiles.user_profile_menu.connected_walletconnect');
  });

  it('setWalletConnectStatus false', () => {
    const tplCategory = _walletConnectMenuCategory().setWalletConnectStatus(false).json();
    expect(tplCategory.connected).toBeFalse();
    expect(tplCategory.legend).toEqual('profiles.user_profile_menu.disconnected_walletconnect');
  });
});
