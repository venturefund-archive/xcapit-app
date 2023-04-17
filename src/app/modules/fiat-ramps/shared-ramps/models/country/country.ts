export type RawCountry = {
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

export class Country {

  constructor(private _rawData: RawCountry) {}

  name(): string {
    return this._rawData.name;
  }

  isoCodeAlpha3(): string {
    return this._rawData.isoCodeAlpha3;
  }

  flagRoute(): string {
    return this._rawData.flagRoute;
  }
}
