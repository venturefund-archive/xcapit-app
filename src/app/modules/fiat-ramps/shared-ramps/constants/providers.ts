import { FiatRampProvider } from '../interfaces/fiat-ramp-provider.interface';

export const PROVIDERS: FiatRampProvider[] = [
  {
    id: 3,
    alias: 'moonpay',
    name: 'Moonpay',
    logoRoute: 'assets/img/provider-logos/Moonpay.svg',
    description: 'fiat_ramps.select_provider.moonpay_description',
    newOperationRoute: '/fiat-ramps/new-operation/moonpay',
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
    logoRoute: 'assets/img/provider-logos/KriptonMarket.svg',
    description: 'fiat_ramps.select_provider.krypton_description',
    disclaimer: 'fiat_ramps.shared.constants.providers.kripton.disclaimer',
    newOperationRoute: '/fiat-ramps/new-operation/kripton',
    countries: ['Argentina', 'Venezuela', 'Uruguay', 'Colombia'],
    currencies: [
      { symbol: 'DAI', network: 'MATIC' },
      { symbol: 'MATIC', network: 'MATIC' },
    ],
  },
];
