import { RawLender } from './raw-lender.type';

export const rawLender: RawLender = {
  name: 'naranjax',
  icon: 'assets/ux-icons/ux-logo-naranjax.svg',
  title: 'wallets.select_wallet_type.warranty_wallet.title',
  description: 'wallets.select_wallet_type.warranty_wallet.description',
  firstStepUrl: '/wallets/steps',
  trackClickEvent: 'ux_create_select_naranjax',
  isWarrantyLender: true,
  address: '0x2de9449eceb7b336a776cf43b3f3916cf1b51aa6',
  logo: 'assets/img/warranty/naranjax.svg',
  maxAmount: '100',
  minAmount: '10',
  url: 'https://www.naranjax.com/',
  token: 'USDC',
  blockchain: 'MATIC',
  xscrowAddress: '0xd8090Ca934aF77C3Ab835b7F01d06f215e906153',
  language: 'es',
  steps: [
    'wallets.user_steps.shared_steps.item_1',
    'wallets.user_steps.shared_steps.item_2',
    'wallets.user_steps.shared_steps.item_3',
    'wallets.user_steps.naranja_x.item_1',
  ],
  stepsTitle: 'wallets.user_steps.naranja_x.title',
  buyOrDepositModalHeader: 'warranties.modal_info_to_buy_or_deposit.naranja_x.header',
  hasCryptoModalDescription: 'warranties.modal_has_crypto.naranja_x.description',
  infoModalHighlightedHeader: 'warranties.modal_info.highlightedHeader',
};
