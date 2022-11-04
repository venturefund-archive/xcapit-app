import { FiatRampProviderCountry } from '../interfaces/fiat-ramp-provider-country';

export const COUNTRIES: FiatRampProviderCountry[] = [
  { name: 'Mexico', isoCodeAlpha3: 'MEX', iso4217CurrencyCode: 'MXN', value: 'fiat_ramps.countries_list.mexico', directaCode: 'MX',isoCurrencyCodeDirecta: 'MXN'},
  { name: 'Guatemala', isoCodeAlpha3: 'GTM', iso4217CurrencyCode: 'GTQ',  value: 'fiat_ramps.countries_list.guatemala' },
  { name: 'Honduras', isoCodeAlpha3: 'HND', iso4217CurrencyCode: 'HNL', value: 'fiat_ramps.countries_list.honduras' },
  { name: 'Costa Rica', isoCodeAlpha3: 'CRI', iso4217CurrencyCode: 'CRC', value: 'fiat_ramps.countries_list.costa_rica', fiatCode: 'crc'},
  { name: 'Colombia', isoCodeAlpha3: 'COL', iso4217CurrencyCode: 'COP', value: 'fiat_ramps.countries_list.colombia', fiatCode: 'cop',  directaCode: 'CO',isoCurrencyCodeDirecta: 'COP'},
  { name: 'Argentina', isoCodeAlpha3: 'ARS', iso4217CurrencyCode: 'ARS', value: 'fiat_ramps.countries_list.argentina', fiatCode: 'ars',  directaCode: 'AR', isoCurrencyCodeDirecta: 'ARS'},
  { name: 'Brasil', isoCodeAlpha3: 'BRA', iso4217CurrencyCode: 'BRL', value: 'fiat_ramps.countries_list.brasil', directaCode: 'BR', isoCurrencyCodeDirecta:'BRL'},
  { name: 'El Salvador', isoCodeAlpha3: 'SLV', iso4217CurrencyCode: 'SVC', value: 'fiat_ramps.countries_list.el_salvador' },
  { name: 'Guyana', isoCodeAlpha3: 'GUY', iso4217CurrencyCode: 'GYD', value: 'fiat_ramps.countries_list.guyana' },
  { name: 'Paraguay', isoCodeAlpha3: 'PRY', iso4217CurrencyCode: 'PYG', value: 'fiat_ramps.countries_list.paraguay' },
  { name: 'Australia', isoCodeAlpha3: 'AUS', iso4217CurrencyCode: 'AUD', value: 'fiat_ramps.countries_list.australia' },
  { name: 'Peru', isoCodeAlpha3: 'PER', iso4217CurrencyCode: 'PEN', value: 'fiat_ramps.countries_list.peru', directaCode: 'PE',isoCurrencyCodeDirecta:'PEN'},
  { name: 'Portugal', isoCodeAlpha3: 'PRT', iso4217CurrencyCode: 'EUR', value: 'fiat_ramps.countries_list.portugal'},
  { name: 'España', isoCodeAlpha3: 'ESP', iso4217CurrencyCode: 'EUR', value: 'fiat_ramps.countries_list.spain' },
  { name: 'Uruguay', isoCodeAlpha3: 'URY', iso4217CurrencyCode: 'UYU', value: 'fiat_ramps.countries_list.uruguay',fiatCode: 'uyu' },
  { name: 'Estados Unidos', isoCodeAlpha3: 'USA', iso4217CurrencyCode: 'USD', value: 'fiat_ramps.countries_list.united_states', isoCurrencyCodeMoonpay: 'USD' },
  { name: 'Venezuela', isoCodeAlpha3: 'VEN', iso4217CurrencyCode: 'VEF', value: 'fiat_ramps.countries_list.venezuela', fiatCode: 'ves' },
  { name: 'Chile', isoCodeAlpha3: 'CHL', iso4217CurrencyCode: 'CLP', value: 'fiat_ramps.countries_list.chile', directaCode: 'CL', isoCurrencyCodeDirecta:'CLP'},
  { name: 'Ecuador', isoCodeAlpha3: 'ECU', iso4217CurrencyCode: 'USD', value: 'fiat_ramps.countries_list.ecuador', directaCode: 'EC', isoCurrencyCodeDirecta:'USD'},
];
