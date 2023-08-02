import { RawMenuItem } from './menu-item/raw-menu-item';

export type RawMenuCategory = {
  position: number;
  category_title: string;
  visible: boolean;
  icon: string;
  route: string;
  name: string;
  buttonName: string;
  legend: string; // TODO: Ver si esto podria ser opcional ya que es solo para WalletConnect
  connected: boolean; // TODO: Ver si esto podria ser opcional ya que es solo para WalletConnect
  newBadge: boolean;
  isWarrantyWalletOpt: boolean;
  items: RawMenuItem[];
};
