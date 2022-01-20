import { MenuCategory } from '../interfaces/menu-category.interface';

export const ITEM_MENU: MenuCategory[] = [
  {
    category_title: 'profiles.user_profile_menu.category_walletconnect',
    icon: 'assets/ux-icons/wallet-connect-icon.svg',
    route: '/wallets/wallet-connect/new-connection',
    name: 'WalletConnect',
  },
  {
    category_title: 'profiles.user_profile_menu.category_help',
    icon: 'assets/ux-icons/ux-support.svg',
    items: [
      {
        name: 'Faq',
        text: 'profiles.user_profile_menu.faq_help',
        route: '/support/options',
        type: 'link',
      },
      {
        name: 'Support',
        text: 'profiles.user_profile_menu.support_help',
        route: 'tickets/create-support-ticket',
        type: 'link',
      },
    ],
  },
  {
    category_title: 'profiles.user_profile_menu.category_security_account',
    icon: 'assets/ux-icons/ux-lock-outline.svg',
    items: [
      {
        name: 'PasswordChangeAccount',
        text: 'profiles.user_profile_menu.change_pass',
        route: '/users/password-change',
        type: 'link',
      },
    ],
  },
  {
    category_title: 'profiles.user_profile_menu.category_security_wallet',
    icon: 'assets/ux-icons/ux-key-outline.svg',
    items: [
      {
        name: 'WalletPasswordChange',
        text: 'profiles.user_profile_menu.change_pass',
        route: '/wallets/password-change',
        type: 'link',
      },
      {
        name: 'RecoveryPhrase',
        text: 'profiles.user_profile_menu.security_phrase',
        route: '/wallets/recovery/info',
        type: 'link',
      },
    ],
  },
  {
    category_title: 'profiles.user_profile_menu.category_binance_investment',
    icon: 'assets/ux-icons/ux-trending-up.svg',
    items: [
      {
        name: 'Funds',
        text: 'profiles.user_profile_menu.funds',
        route: '/tabs/investments',
        type: 'link',
      },
      {
        name: 'FinishedFunds',
        text: 'profiles.user_profile_menu.finished_funds',
        route: 'funds/funds-finished',
        type: 'link',
      },
      {
        name: 'ApiKeysList',
        text: 'profiles.user_profile_menu.manage_apikey',
        route: '/apikeys/list',
        type: 'link',
      },
    ],
  },
];
