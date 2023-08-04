import { MenuItem } from './menu-item';
import { rawMenuItemSupport } from './menu-items.raw';

describe('MenuItem', () => {
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

  it('position', () => {
    expect(menuItem.position()).toEqual(rawMenuItemSupport.position);
  });

  it('json', () => {
    expect(menuItem.json()).toEqual(rawMenuItemSupport);
  });

  it('hide', () => {
    menuItem = menuItem.hide()
    expect(menuItem.json().visible).toBeFalse();
  });

  it('show', () => {
    menuItem = menuItem.hide()
    menuItem = menuItem.show()
    expect(menuItem.json().visible).toBeTrue();
  });
});
