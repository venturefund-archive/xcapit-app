import { RawMenuCategory } from '../raw-menu-category';

export const RAW_MENU_CATEGORIES: RawMenuCategory[] = [
  {
    position: 1,
    name: 'WalletConnect',
    category_title: 'profiles.user_profile_menu.category_walletconnect',
    icon: 'assets/ux-icons/wallet-connect-blue-icon.svg',
    route: '/wallets/wallet-connect/new-connection',
    buttonName: 'ux_menu_go_to_wallet_connect',
    legend: 'profiles.user_profile_menu.disconnected_walletconnect',
    connected: false,
    visible: true,
    isWarrantyWalletOpt: false,
    newBadge: false,
    items: [],
  },
  {
    position: 2,
    name: 'Contacts',
    category_title: 'profiles.user_profile_menu.category_contacts',
    icon: 'assets/ux-icons/wallets-list.svg',
    route: '/contacts/home',
    buttonName: 'ux_go_to_address_list',
    legend: '',
    connected: false,
    visible: true,
    isWarrantyWalletOpt: false,
    newBadge: true,
    items: [],
  },
  {
    position: 3,
    name: 'Help',
    category_title: 'profiles.user_profile_menu.category_help',
    icon: 'assets/ux-icons/ux-support-primary.svg',
    route: '',
    buttonName: '',
    legend: '',
    connected: false,
    visible: true,
    isWarrantyWalletOpt: true,
    newBadge: false,
    items: [],
  },
  {
    position: 4,
    name: 'Wallet',
    category_title: 'profiles.user_profile_menu.category_security_wallet',
    icon: 'assets/ux-icons/ux-key-primary.svg',
    route: '',
    buttonName: '',
    legend: '',
    connected: false,
    visible: true,
    isWarrantyWalletOpt: true,
    newBadge: false,
    items: [],
  },
];
