import { rawMenuItemSupport, rawMenuItemCommunity, rawMenuItems } from '../menu-item/menu-items.raw';
import { MenuItemDataRepo } from './menu-item-data-repo';

describe('MenuItemDataRepo', () => {
  let menuItemDataRepo: MenuItemDataRepo;

  beforeEach(() => {
    menuItemDataRepo = new MenuItemDataRepo(rawMenuItems);
  });

  it('new', () => {
    expect(menuItemDataRepo).toBeTruthy();
  });

  it('byCategory', () => {
    expect(menuItemDataRepo.byCategory('Help')).toEqual([rawMenuItemSupport, rawMenuItemCommunity]);
  });
});
