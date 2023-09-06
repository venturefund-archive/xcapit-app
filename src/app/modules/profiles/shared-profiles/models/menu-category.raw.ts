import { RawMenuCategory } from './raw-menu-category';

export const rawMenuCategoryWalletConnect: RawMenuCategory = {
  position: 1,
  category_title: 'profiles.user_profile_menu.category_walletconnect',
  icon: 'assets/ux-icons/wallet-connect-blue-icon.svg',
  route: '/wallets/wallet-connect/new-connection',
  name: 'WalletConnect',
  buttonName: 'ux_menu_go_to_wallet_connect',
  legend: 'profiles.user_profile_menu.disconnected_walletconnect',
  connected: false,
  visible: true,
  isWarrantyWalletOpt: false,
  newBadge: false,
  items: []
};

export const rawMenuCategoryHelp: RawMenuCategory = {
  position: 2,
  category_title: 'profiles.user_profile_menu.category_help',
  visible: true,
  isWarrantyWalletOpt: true,
  icon: 'assets/ux-icons/ux-support-primary.svg',
  name: 'Help',
  buttonName: '',
  route: '',
  legend: '',
  connected: false,
  newBadge: false,
  items: []
};

export const rawMenuCategories = [rawMenuCategoryWalletConnect, rawMenuCategoryHelp];
