import { RawLender } from './raw-lender.type';

export const rawLender: RawLender = {
  icon: 'assets/ux-icons/ux-logo-naranjax.svg',
  title: 'wallets.select_wallet_type.warranty_wallet.title',
  description: 'wallets.select_wallet_type.warranty_wallet.description',
  firstStepUrl: '/wallets/steps-naranjax',
  trackClickEvent: 'ux_create_select_naranjax',
  isWarrantyLender: true,
};

export const rawNullLender: RawLender = {
  icon: 'assets/ux-icons/ux-checked-info.svg',
  title: 'wallets.select_wallet_type.web3_wallet.title',
  description: 'wallets.select_wallet_type.web3_wallet.description',
  firstStepUrl: '/wallets/create-password/create',
  trackClickEvent: 'ux_create_select_web3',
  isWarrantyLender: false,
};
