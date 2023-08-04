import { MenuItemDataRepo } from '../../menu-item-data-repo/menu-item-data-repo';
import { rawMenuItems } from '../../menu-item/menu-items.raw';
import { MenuItems } from '../menu-items.interface';
import { DefaultMenuItems } from './default-menu-items';

describe('DefaultMenuItems', () => {
  let menuItems: MenuItems;

  beforeEach(() => {
    menuItems = new DefaultMenuItems(new MenuItemDataRepo(rawMenuItems));
  });

  it('new', () => {
    expect(menuItems).toBeTruthy();
  });

  it('byCategory', () => {
    expect(menuItems.byCategory('Help').length).toEqual(2);
  });

  it('hide', () => {
    menuItems = menuItems.hide('Help', 'Community');
    expect(menuItems.byCategory('Help')[1].json().visible).toBeFalse();
  });

  it('show', () => {
    menuItems = menuItems.hide('Help', 'Community');
    menuItems = menuItems.show('Help', 'Community');
    expect(menuItems.byCategory('Help')[1].json().visible).toBeTrue();
  });
});
