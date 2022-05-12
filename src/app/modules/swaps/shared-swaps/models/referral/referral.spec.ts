import { rawOneInchDefaultsData } from "../fixtures/raw-one-inch-defaults-data";
import { Referral } from "./referral";


describe('Referral', () => {

  it('new', () => {
    expect(new Referral()).toBeTruthy();
  })

  it('fee access', () => {
    expect(new Referral(rawOneInchDefaultsData).fee()).toEqual(0.5);
  });

  it('wallet address access', () => {
    expect(new Referral(rawOneInchDefaultsData).walletAddress()).toEqual('0x0');
  });
});
