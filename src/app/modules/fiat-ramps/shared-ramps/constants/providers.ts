import { FiatRampProvider } from '../interfaces/fiat-ramp-provider.interface';

export const PROVIDERS: FiatRampProvider[] = [
  {
    id: 3,
    alias: 'moonpay',
    name: 'Moonpay',
    trackClickEventName: "ux_buy_moonpay",
    logoRoute: 'assets/img/provider-logos/Moonpay.svg',
    description: 'fiat_ramps.select_provider.moonpay_description',
    newOperationRoute: '/fiat-ramps/new-operation/moonpay',
    disclaimer: 'fiat_ramps.moonpay.disclaimer',
    countries: [
      'Argentina',
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
  },
  //TODO DEJAR COMENTADO KRIPTON, CAMBIAR URL REDIRECCION
  {
    id: 1,
    alias: 'kripton',
    name: 'Kripton Market',
    logoRoute: 'assets/img/provider-logos/KriptonMarket.svg',
    description: 'fiat_ramps.select_provider.krypton_description',
    disclaimer: 'fiat_ramps.shared.constants.providers.kripton.disclaimer',
    newOperationRoute: '/fiat-ramps/new-operation/kripton',
    trackClickEventName: "ux_buy_kripton",
    countries: ['Argentina', 'Venezuela', 'Uruguay', 'Colombia'],
    currencies: [
      { symbol: 'DAI', network: 'MATIC' },
      { symbol: 'MATIC', network: 'MATIC' },
    ],
  },
  {
    id: 2,
    alias: 'mercadopago',
    name: 'Mercado Pago',
    trackClickEventName: "ux_buy_mercadopago",
    logoRoute: 'assets/img/provider-logos/Moonpay.svg',
    description: 'fiat_ramps.select_provider.moonpay_description',
    newOperationRoute: '/fiat-ramps/new-operation/others',
    countries: [
      'Argentina'
    ],
    currencies: [
      { symbol: 'DAI', network: 'MATIC' },
    ],
  },
];
