import { MenuItems } from '../menu-items.interface';
import { MenuItem } from '../../menu-item/menu-item';

export class FakeMenuItems implements MenuItems {

  byCategory(_aCategoryName: string): MenuItem[] {
    return [];
  }

  hide(_aCategoryName: string, _anItemName: string = null): MenuItems {
    return new FakeMenuItems();
  }

  show(_aCategoryName: string, _anItemName: string = null): MenuItems {
    return new FakeMenuItems();
  }
}
