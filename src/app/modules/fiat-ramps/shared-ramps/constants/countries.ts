import { FiatRampProviderCountry } from '../interfaces/fiat-ramp-provider-country';

export const COUNTRIES: FiatRampProviderCountry[] = [
  { name: 'Mexico', isoCodeAlpha3: 'MEX', value: 'fiat_ramps.countries_list.mexico', directaCode: 'MX'},
  { name: 'Guatemala', isoCodeAlpha3: 'GTM',  value: 'fiat_ramps.countries_list.guatemala' },
  { name: 'Honduras', isoCodeAlpha3: 'HND', value: 'fiat_ramps.countries_list.honduras' },
  { name: 'Costa Rica', isoCodeAlpha3: 'CRI', value: 'fiat_ramps.countries_list.costa_rica', fiatCode: 'crc'},
  { name: 'Colombia', isoCodeAlpha3: 'COL', value: 'fiat_ramps.countries_list.colombia', fiatCode: 'cop',  directaCode: 'CO'},
  { name: 'Argentina', isoCodeAlpha3: 'ARS', value: 'fiat_ramps.countries_list.argentina', fiatCode: 'ars',  directaCode: 'AR'},
  { name: 'Brasil', isoCodeAlpha3: 'BRA', value: 'fiat_ramps.countries_list.brasil', directaCode: 'BR'},
  { name: 'El Salvador', isoCodeAlpha3: 'SLV', value: 'fiat_ramps.countries_list.el_salvador' },
  { name: 'Guyana', isoCodeAlpha3: 'GUY', value: 'fiat_ramps.countries_list.guyana' },
  { name: 'Paraguay', isoCodeAlpha3: 'PRY', value: 'fiat_ramps.countries_list.paraguay' },
  { name: 'Australia', isoCodeAlpha3: 'AUS', value: 'fiat_ramps.countries_list.australia' },
  { name: 'Peru', isoCodeAlpha3: 'PER', value: 'fiat_ramps.countries_list.peru', directaCode: 'PE'},
  { name: 'Portugal', isoCodeAlpha3: 'PRT', value: 'fiat_ramps.countries_list.portugal' },
  { name: 'España', isoCodeAlpha3: 'ESP', value: 'fiat_ramps.countries_list.spain' },
  { name: 'Uruguay', isoCodeAlpha3: 'URY', value: 'fiat_ramps.countries_list.uruguay', fiatCode: 'uyu' },
  { name: 'Estados Unidos', isoCodeAlpha3: 'USA', value: 'fiat_ramps.countries_list.united_states' },
  { name: 'Venezuela', isoCodeAlpha3: 'VEN', value: 'fiat_ramps.countries_list.venezuela', fiatCode: 'ves' },
  { name: 'Chile', isoCodeAlpha3: 'CHL', value: 'fiat_ramps.countries_list.chile', directaCode: 'CL'},
  { name: 'Ecuador', isoCodeAlpha3: 'ECU', value: 'fiat_ramps.countries_list.ecuador', directaCode: 'EC'},
];
