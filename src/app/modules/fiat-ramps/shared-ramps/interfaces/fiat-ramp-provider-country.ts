export interface FiatRampProviderCountry {
  name: string;
  value: string;
  fiatCode?: string;
  isoCodeAlpha3: string;
  iso4217CurrencyCode: string;
  directaCode?: string;
  isoCurrencyCodeDirecta?: string;
  isoCurrencyCodeMoonpay?: string;
  flagRoute?: string;
}
