import { FiatRampProviderCountry } from '../interfaces/fiat-ramp-provider-country';

export const COUNTRIES: FiatRampProviderCountry[] = [
  { name: 'Mexico', value: 'fiat_ramps.countries_list.mexico' },
  { name: 'Guatemala', value: 'fiat_ramps.countries_list.guatemala' },
  { name: 'Honduras', value: 'fiat_ramps.countries_list.honduras' },
  { name: 'Costa Rica', value: 'fiat_ramps.countries_list.costa_rica', fiatCode: 'crc'},
  { name: 'Colombia', value: 'fiat_ramps.countries_list.colombia', fiatCode: 'cop', isoCode: 'COL' },
  { name: 'Argentina', value: 'fiat_ramps.countries_list.argentina', fiatCode: 'ars', isoCode: 'ARS' },
  { name: 'Australia', value: 'fiat_ramps.countries_list.australia' },
  { name: 'El Salvador', value: 'fiat_ramps.countries_list.el_salvador' },
  { name: 'Guyana', value: 'fiat_ramps.countries_list.guyana' },
  { name: 'Paraguay', value: 'fiat_ramps.countries_list.paraguay' },
  { name: 'Peru', value: 'fiat_ramps.countries_list.peru' },
  { name: 'Portugal', value: 'fiat_ramps.countries_list.portugal' },
  { name: 'España', value: 'fiat_ramps.countries_list.spain' },
  { name: 'Uruguay', value: 'fiat_ramps.countries_list.uruguay', fiatCode: 'uyu' },
  { name: 'Estados Unidos', value: 'fiat_ramps.countries_list.united_states' },
  { name: 'Venezuela', value: 'fiat_ramps.countries_list.venezuela', fiatCode: 'ves' },
];
