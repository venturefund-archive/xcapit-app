import { AmountOf } from "./amount-of";
import { rawUSDCData } from "../fixtures/raw-tokens-data";
import { DefaultToken } from "../token/token";


describe('Amount Of', () => {

  let amount: AmountOf;
  const aWeiAmount = '6196';
  const anAmount = 0.006196;

  beforeEach(() => {
    amount = new AmountOf(aWeiAmount, new DefaultToken(rawUSDCData));
  });

  it('new', () => {
    expect(amount).toBeTruthy();
  });

  it('value access', () => {
    expect(amount.value()).toEqual(anAmount);
  });
});
