export const rawProvidersData = [
  {
    id: 3,
    alias: 'moonpay',
    name: 'Moonpay',
    trackClickEventName: 'ux_buy_moonpay',
    logoRoute: 'assets/img/provider-logos/Moonpay.svg',
    description: 'fiat_ramps.select_provider.moonpay_description',
    newOperationRoute: '/fiat-ramps/moonpay',
    countries: [
      'Mexico',
      'Guatemala',
      'Honduras',
      'Costa Rica',
      'Colombia',
      'Argentina',
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
  },
  {
    id: 1,
    alias: 'kripton',
    name: 'Kripton Market',
    trackClickEventName: 'ux_buy_kripton',
    logoRoute: 'assets/img/provider-logos/KriptonMarket.svg',
    description: 'fiat_ramps.select_provider.krypton_description',
    newOperationRoute: '/fiat-ramps/new-operation',
    countries: ['Argentina', 'Venezuela', 'Uruguay', 'Peru', 'Colombia'],
    currencies: [
      { symbol: 'DAI', network: 'MATIC' },
      { symbol: 'MATIC', network: 'MATIC' },
    ],
  },
  {
    id: 2,
    alias: 'mercadopago',
    name: 'Mercado Pago',
    logoRoute: 'assets/img/provider-logos/Moonpay.svg',
    description: 'fiat_ramps.select_provider.moonpay_description',
    newOperationRoute: '/fiat-ramps/new-operation/others/mercadopago',
    trackClickEventName: "ux_buy_mercadopago",
    countries: [
      'Argentina'
    ],
    currencies: [
      { symbol: 'USDC', network: 'MATIC' },
    ],
  }
];
