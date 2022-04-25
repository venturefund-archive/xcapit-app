import { FiatRampProvider } from "../interfaces/fiat-ramp-provider.interface";

export const PROVIDERS: FiatRampProvider[] = [
  {
    id: 1,
    alias: 'kripton',
    name: 'KriptonMarket',
    logoRoute: '../../assets/img/provider-logos/KriptonMarket.svg',
    newOperationRoute: '/fiat-ramps/new-operation',
  },
  {
    id: 2,
    alias: 'paxful',
    name: 'Paxful',
    logoRoute: '../../assets/img/provider-logos/Paxful.svg',
    newOperationRoute: '/fiat-ramps/information-paxful',
  },
];
