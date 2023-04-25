import { CountryRepo } from "../country-repo/country-repo";
import { Countries } from "./countries";
import { rawCountriesData, rawMexicoData } from "./fixtures/raw-country-data";


describe('Countries', () => {
  let countries: Countries;
  const rawCountry = rawMexicoData;
  const repo = new CountryRepo(rawCountriesData);

  beforeEach(() => {
    countries = new Countries(repo);
  });

  it('new', () => {
    expect(countries).toBeTruthy();
  });

  it('findByAlpha3', () => {
    expect(countries.findByAlpha3(rawCountry.isoCodeAlpha3).name()).toEqual(rawCountry.name);
  });

  it('findByName', () => {
    expect(countries.findByName(rawCountry.name).name()).toEqual(rawCountry.name);
  });

  it('findByCurrencyCode', () => {
    expect(countries.findByCurrencyCode(rawCountry.iso4217CurrencyCode).name()).toEqual(rawCountry.name);
  });
});
