import { FiatRampProvider } from '../interfaces/fiat-ramp-provider.interface';

export const PROVIDERS: FiatRampProvider[] = [
  {
    id: 1,
    alias: 'kripton',
    showInfo: true,
    name: 'Kripton Market',
    providerName: 'kripton',
    logoRoute: 'assets/img/provider-logos/KriptonMarket.svg',
    description: 'fiat_ramps.select_provider.krypton_description',
    newOperationRoute: '/fiat-ramps/new-operation/kripton',
    trackClickEventName: 'ux_buy_kripton',
    countries: ['Argentina', 'Venezuela', 'Uruguay', 'Colombia'],
    currencies: [
      { symbol: 'DAI', network: 'MATIC' },
      { symbol: 'MATIC', network: 'MATIC' },
    ],
  },
  {
    id: 2,
    alias: 'moonpay',
    showInfo: true,
    name: 'Moonpay',
    providerName: 'moonpay',
    trackClickEventName: 'ux_buy_moonpay',
    logoRoute: 'assets/img/provider-logos/Moonpay.svg',
    description: 'fiat_ramps.select_provider.moonpay_description',
    newOperationRoute: '/fiat-ramps/new-operation/moonpay',
    countries: [
      'Mexico',
      'Guatemala',
      'Honduras',
      'Costa Rica',
      'Colombia',
      'Australia',
      'El Salvador',
      'Guyana',
      'Paraguay',
      'Peru',
      'Portugal',
      'España',
      'Uruguay',
      'Estados Unidos',
    ],
    currencies: [
      { symbol: 'ETH', network: 'ERC20' },
      { symbol: 'LINK', network: 'ERC20' },
      { symbol: 'USDT', network: 'ERC20' },
      { symbol: 'AAVE', network: 'ERC20' },
      { symbol: 'UNI', network: 'ERC20' },
      { symbol: 'MANA', network: 'ERC20' },
      { symbol: 'ENJ', network: 'ERC20' },
      { symbol: 'MATIC', network: 'MATIC' },
      { symbol: 'BNB', network: 'BSC_BEP20' },
      { symbol: 'USDC', network: 'MATIC' },
    ],
  },
  {
    id: 3,
    alias: 'MP',
    name: 'Mercado Pago',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/MercadoPago.svg',
    description: 'fiat_ramps.select_provider.directa24.platform_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_mercadopago',
    countries: ['Chile'],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 4,
    alias: 'RP',
    name: 'Rapipago',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/Rapipago.svg',
    description: 'fiat_ramps.select_provider.directa24.nearest_store_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_Rapipago',
    countries: [],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 5,
    alias: 'PF',
    name: 'Pagofacil',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/Pagofacil.svg',
    description: 'fiat_ramps.select_provider.directa24.nearest_store_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_Pagofacil',
    countries: [],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 6,
    alias: 'UU',
    name: 'UALA',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/UALA.svg',
    description: 'fiat_ramps.select_provider.directa24.nearest_store_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_UALA',
    countries: [],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 7,
    alias: 'SE',
    name: 'Spei',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/SPEI.svg',
    description: 'fiat_ramps.select_provider.directa24.platform_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_SPEI',
    countries: ['Mexico'],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 8,
    alias: 'OX',
    name: 'Oxxo',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/Oxxo.svg',
    description: 'fiat_ramps.select_provider.directa24.nearest_store_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_Oxxo',
    countries: ['Mexico'],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 9,
    alias: 'VI',
    name: 'Visa',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/VISA.svg',
    description: 'fiat_ramps.select_provider.directa24.debit_credit_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_Visa',
    countries: ['Chile', 'Peru', 'Mexico', 'Colombia', 'Ecuador'],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 10,
    alias: 'MC',
    name: 'Mastercard',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/Mastercard.svg',
    description: 'fiat_ramps.select_provider.directa24.debit_credit_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_Mastercard',
    countries: ['Chile', 'Peru', 'Mexico', 'Colombia', 'Ecuador'],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 11,
    alias: 'PC',
    name: 'PSE',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/PSE.svg',
    description: 'fiat_ramps.select_provider.directa24.platform_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_PSE',
    countries: ['Colombia'],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 12,
    alias: 'EY',
    name: 'Efecty',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/Efecty.svg',
    description: 'fiat_ramps.select_provider.directa24.nearest_store_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_Efecty',
    countries: ['Colombia'],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 13,
    alias: 'WU',
    name: 'Western Union',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/WU.svg',
    description: 'fiat_ramps.select_provider.directa24.nearest_branch_office_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_WesternUnion',
    countries: ['Peru'],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 14,
    alias: 'EF',
    name: 'Pago Efectivo',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/PagoEfectivo.svg',
    description: 'fiat_ramps.select_provider.directa24.nearest_store_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_PagoEfectivo',
    countries: ['Peru'],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 15,
    alias: 'GB',
    name: 'Banco Guayaquil',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/BancoGuayaquil.svg',
    description: 'fiat_ramps.select_provider.directa24.transfer_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_BGUAYAQUIL',
    countries: ['Ecuador'],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 16,
    alias: 'PX',
    name: 'Banco Pichincha',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/BancoPichincha.svg',
    description: 'fiat_ramps.select_provider.directa24.nearest_branch_office_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_BPICHINCHA',
    countries: ['Ecuador'],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
  {
    id: 17,
    alias: 'SC',
    name: 'Banco Santander',
    providerName: 'directa24',
    logoRoute: 'assets/img/provider-logos/directa24/BancoSantander.svg',
    description: 'fiat_ramps.select_provider.directa24.transfer_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    trackClickEventName: 'ux_buy_d24_BancoSantander',
    countries: ['Chile'],
    currencies: [{ symbol: 'USDC', network: 'MATIC' }],
  },
];
