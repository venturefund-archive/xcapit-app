import { rawArgentinaData } from "../countries/fixtures/raw-country-data";
import { Country } from "./country";


describe('Country', () => {

  let country: Country;

  beforeEach(() => {
    country = new Country(rawArgentinaData);
  });

  it('new', () => {
    expect(country).toBeTruthy();
  });

  it('name', () => {
    expect(country.name()).toEqual(rawArgentinaData.name);
  });

  it('isoCodeAlpha3', () => {
    expect(country.isoCodeAlpha3()).toEqual(rawArgentinaData.isoCodeAlpha3);
  });

  it('iso4217CurrencyCode', () => {
    expect(country.iso4217CurrencyCode()).toEqual(rawArgentinaData.iso4217CurrencyCode);
  });

  it('flagRoute', () => {
    expect(country.flagRoute()).toEqual(rawArgentinaData.flagRoute);
  });
});
