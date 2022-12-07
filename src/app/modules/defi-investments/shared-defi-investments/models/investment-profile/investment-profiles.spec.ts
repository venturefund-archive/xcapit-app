import { InvestmentProfiles } from './investment-profiles';

describe('InvestmentProfiles', () => {
  it('new', () => {
    expect(new InvestmentProfiles()).toBeTruthy();
  });

  it('all', () => {
    expect(new InvestmentProfiles().all().length).toEqual(3);
  });
});
