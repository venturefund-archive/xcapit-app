import { rawCountriesData } from '../countries/fixtures/raw-country-data';
import { CountryRepo } from './country-repo';


describe('CountryRepo', () => {
  let repo: CountryRepo;

  beforeEach(() => {
    repo = new CountryRepo(rawCountriesData);
  });

  it('new', () => {
    expect(repo).toBeTruthy();
  });

  it('all', () => {
    expect(repo.all()).toBeTruthy();
  });
});
