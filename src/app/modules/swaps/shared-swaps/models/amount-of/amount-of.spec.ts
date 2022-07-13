import { AmountOf, NullAmountOf } from "./amount-of";
import { rawUSDCData } from "../fixtures/raw-tokens-data";
import { DefaultToken, Token } from "../token/token";


fdescribe('Amount Of', () => {

  let amount: AmountOf;
  const usdcToken: Token = new DefaultToken(rawUSDCData);
  const aWeiAmount = '6196';
  const anAmount = 0.006196;

  beforeEach(() => {
    amount = new AmountOf(aWeiAmount, usdcToken);
  });

  it('new', () => {
    expect(amount).toBeTruthy();
  });

  it('value access', () => {
    expect(amount.value()).toEqual(anAmount);
  });

  it('mul', () => {
    const aNewWeiAmount = (parseFloat(aWeiAmount) * 2).toString();
    const expectedResult: AmountOf = new AmountOf(aNewWeiAmount, usdcToken);

    const twoTimesAmount: AmountOf = amount.times(2);

    expect(twoTimesAmount.value()).toEqual(expectedResult.value());
  });

  it('json', () => {
    expect(amount.json().value).toEqual(anAmount);
    expect(amount.json().token).toEqual(usdcToken.symbol());
  });
});


fdescribe('NullAmountOf', () => {

  const amount = new NullAmountOf();

  it('new', () => {
    expect(amount).toBeTruthy();
  });

  it('json', () => {
    expect(amount.json().value).toEqual(undefined);
    expect(amount.json().token).toEqual(undefined);
  });
});
