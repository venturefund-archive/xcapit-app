import { CountryRepo } from "../country-repo/country-repo";
import { Country } from "../country/country";


export class Countries {

  constructor(private _aDataRepo: CountryRepo) {}

  findByAlpha3(aISOAlpha3Code: string): Country {
    return new Country(
      this._aDataRepo.all().find(country => country.isoCodeAlpha3 === aISOAlpha3Code)
    );
  }
  
  findByCurrencyCode(aISO4217CurrencyCode: string): Country {
    return new Country(
      this._aDataRepo.all().find(country => country.iso4217CurrencyCode === aISO4217CurrencyCode)
    );
  }

  findByName(aName: string): Country {
    return new Country(
      this._aDataRepo.all().find(country => country.name === aName)
    );
  }
}
