import { RawLender } from './raw-lender.type';

export const rawLender: RawLender = {
  name: 'naranjax',
  icon: 'assets/ux-icons/ux-logo-naranjax.svg',
  title: 'wallets.select_wallet_type.warranty_wallet.title',
  description: 'wallets.select_wallet_type.warranty_wallet.description',
  firstStepUrl: '/wallets/steps-naranjax',
  trackClickEvent: 'ux_create_select_naranjax',
  isWarrantyLender: true,
  address: '0x2de9449eceb7b336a776cf43b3f3916cf1b51aa6',
  logo: 'assets/img/warranty/naranjax.svg',
  maxAmount: '100',
  minAmount: '10',
  url: 'https://www.naranjax.com/',
};
