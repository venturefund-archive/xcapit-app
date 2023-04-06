import { rawMexicoData } from "../countries/fixtures/raw-country-data";
import { Country } from "./country";


describe('Country', () => {

  let country: Country;

  beforeEach(() => {
    country = new Country(rawMexicoData);
  });

  it('new', () => {
    expect(country).toBeTruthy();
  });

  it('name', () => {
    expect(country.name()).toEqual(rawMexicoData.name);
  });

  it('isoCodeAlpha3', () => {
    expect(country.isoCodeAlpha3()).toEqual(rawMexicoData.isoCodeAlpha3);
  });
});
