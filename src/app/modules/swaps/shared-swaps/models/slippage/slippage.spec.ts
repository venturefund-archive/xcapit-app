import { rawOneInchDefaultsData } from "../fixtures/raw-one-inch-defaults-data";
import { Slippage } from "./slippage";


describe('Slippage', () => {

  it('new', () => {
    expect(new Slippage()).toBeTruthy();
  });

  it('value access', () => {
    expect(new Slippage(rawOneInchDefaultsData).value()).toEqual(1);
  })
});
