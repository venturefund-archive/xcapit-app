import { RawCountry } from "../country/country";


export class CountryRepo {

  constructor(private _rawData: RawCountry[]) {}

  all(): RawCountry[] {
    return this._rawData;
  }
}
