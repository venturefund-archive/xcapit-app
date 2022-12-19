import { MenuCategory } from '../interfaces/menu-category.interface';

export const ITEM_MENU: MenuCategory[] = [
  {
    category_title: 'profiles.user_profile_menu.category_walletconnect',
    icon: 'assets/ux-icons/wallet-connect-blue-icon.svg',
    route: '/wallets/wallet-connect/new-connection',
    name: 'WalletConnect',
    buttonName: 'ux_menu_go_to_wallet_connect',
    legend: 'profiles.user_profile_menu.disconnected_walletconnect',
    connected: false,
    showCategory: true,
  },
  {
    category_title: 'profiles.user_profile_menu.category_help',
    showCategory: true,
    icon: 'assets/ux-icons/ux-support-primary.svg',
    items: [
      {
        name: 'Faq',
        text: 'profiles.user_profile_menu.faq_help',
        route: '/support/options',
        type: 'link',
        buttonName: 'ux_go_to_faq',
      },
      {
        name: 'Support',
        text: 'profiles.user_profile_menu.support_help',
        route: '/tickets/create-support-ticket',
        type: 'link',
        buttonName: 'ux_go_to_contact_support',
      },
      {
        name: 'Community',
        text: 'profiles.user_profile_menu.community',
        route: 'https://t.me/xcapit_es',
        type: 'link',
        buttonName: 'ux_community_telegram',
      },
    ],
  },
  {
    category_title: 'profiles.user_profile_menu.category_security_wallet',
    icon: 'assets/ux-icons/ux-key-primary.svg',
    id: 'wallet',
    showCategory: false,
    items: [
      {
        name: 'WalletPasswordChange',
        text: 'profiles.user_profile_menu.change_pass',
        route: '/wallets/password-change',
        type: 'link',
        buttonName: 'ux_go_to_wallet_change_password',
      },
      {
        name: 'BiometricAuth',
        text: 'profiles.user_profile_menu.biometric_auth',
        route: '/profiles/biometric-auth',
        type: 'link',
        buttonName: 'ux_go_to_biometric_auth',
        hidden: true,
        newBadge: true,
      },
      {
        name: 'RecoveryPhrase',
        text: 'profiles.user_profile_menu.security_phrase',
        route: '/wallets/recovery/info',
        type: 'link',
        buttonName: 'ux_go_to_phrase',
      },
      {
        name: 'PrivateKey',
        text: 'profiles.user_profile_menu.export_private_key',
        route: '/wallets/export-private-key',
        type: 'link',
      },
      {
        name: 'RemoveWallet',
        text: 'profiles.user_profile_menu.remove_wallet',
        route: '/wallets/remove',
        type: 'link',
        buttonName: 'ux_go_to_eliminate_wallet',
      },
    ],
  },
];
