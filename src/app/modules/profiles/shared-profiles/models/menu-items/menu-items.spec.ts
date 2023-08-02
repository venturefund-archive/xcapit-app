import { MenuItemDataRepo } from '../menu-item-data-repo/menu-item-data-repo';
import { rawMenuItems } from '../menu-item/menu-items.raw';
import { MenuItems } from './menu-items';

fdescribe('MenuItems', () => {
  let menuItems: MenuItems;

  beforeEach(() => {
    menuItems = new MenuItems(new MenuItemDataRepo(rawMenuItems));
  });

  it('new', () => {
    expect(menuItems).toBeTruthy();
  });

  it('byCategory', () => {
    expect(menuItems.byCategory('Help').length).toEqual(2);
  });
});
