import { MenuCategoryDataRepo } from '../../menu-category-data-repo/menu-category-data-repo';
import { rawMenuCategories } from '../../menu-category.raw';
import { FakeMenuItems } from '../../menu-items/fake/fake-menu-items';
import { MenuCategories } from '../menu-categories.interface';
import { DefaultMenuCategories } from './default-menu-categories';

describe('DefaultMenuCategories', () => {
  let menuCategories: MenuCategories;

  beforeEach(() => {
    menuCategories = new DefaultMenuCategories(new MenuCategoryDataRepo(rawMenuCategories), new FakeMenuItems());
  });

  it('new', () => {
    expect(menuCategories).toBeTruthy();
  });

  it('all', () => {
    expect(menuCategories.all().length).toEqual(2);
  });

  it('hide', () => {
    menuCategories = menuCategories.hide('Help');
    expect(menuCategories.all()[1].json().visible).toBeFalse();
  });

  it('show', () => {
    menuCategories = menuCategories.hide('Help');
    menuCategories = menuCategories.show('Help');
    expect(menuCategories.all()[1].json().visible).toBeTrue();
  });

  it('hide item', () => {
    menuCategories = menuCategories.hide('Help', 'anItemName');
    expect(menuCategories).toBeTruthy();
  });

  it('show item', () => {
    menuCategories = menuCategories.hide('Help', 'anItemName');
    menuCategories = menuCategories.show('Help', 'anItemName');
    expect(menuCategories).toBeTruthy();
  });
});
