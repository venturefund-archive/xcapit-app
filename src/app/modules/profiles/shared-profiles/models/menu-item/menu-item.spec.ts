import { MenuItem } from './menu-item';
import { rawMenuItemSupport } from './menu-items.raw';

fdescribe('MenuItem', () => {
  let menuItem: MenuItem;

  beforeEach(() => {
    menuItem = new MenuItem(rawMenuItemSupport);
  });

  it('new', () => {
    expect(menuItem).toBeTruthy();
  });

  it('name', () => {
    expect(menuItem.name()).toEqual(rawMenuItemSupport.name);
  });

  it('categoryName', () => {
    expect(menuItem.categoryName()).toEqual(rawMenuItemSupport.categoryName);
  });

  it('json', () => {
    expect(menuItem.json()).toEqual(rawMenuItemSupport);
  });
});
