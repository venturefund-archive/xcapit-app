import { RawMenuItem } from './raw-menu-item';

export const rawMenuItemSupport: RawMenuItem = {
  position: 1,
  name: 'Support',
  text: 'profiles.user_profile_menu.support_help',
  route: '/tickets/create-support-ticket',
  buttonName: 'ux_go_to_contact_support',
  type: 'link',
  newBadge: true,
  visible: false,
  disable: 'false',
  categoryName: 'Help',
};

export const rawMenuItemCommunity: RawMenuItem = {
  position: 2,
  name: 'Community',
  text: 'profiles.user_profile_menu.community',
  route: 'https://t.me/xcapit_es',
  type: 'link',
  buttonName: 'ux_community_telegram',
  newBadge: true,
  visible: false,
  disable: 'false',
  categoryName: 'Help',
};

export const rawMenuItemSecurityConfiguration: RawMenuItem = {
  position: 3,
  name: 'SecurityConfiguration',
  text: 'profiles.user_profile_menu.security_configuration',
  route: '/profiles/security-configuration',
  type: 'link',
  buttonName: 'ux_go_to_security_configuration',
  newBadge: true,
  visible: false,
  disable: 'false',
  categoryName: 'Wallet',
};

export const rawMenuItems: RawMenuItem[] = [rawMenuItemSupport, rawMenuItemCommunity, rawMenuItemSecurityConfiguration];
