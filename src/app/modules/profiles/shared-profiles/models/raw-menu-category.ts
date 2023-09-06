import { RawMenuItem } from './menu-item/raw-menu-item';

export type RawMenuCategory = {
  position: number;
  category_title: string;
  visible: boolean;
  icon: string;
  route: string;
  name: string;
  buttonName: string;
  legend: string;
  connected: boolean;
  newBadge: boolean;
  isWarrantyWalletOpt: boolean;
  items: RawMenuItem[];
};
