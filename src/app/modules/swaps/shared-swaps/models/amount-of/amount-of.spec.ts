import { AmountOf, NullAmountOf } from './amount-of';
import { rawUSDCData } from '../fixtures/raw-tokens-data';
import { DefaultToken, Token } from '../token/token';

describe('Amount Of', () => {
  let amount: AmountOf;
  const usdcToken: Token = new DefaultToken(rawUSDCData);
  const aWeiAmount = '6196';
  const anAmount = 0.006196;
  const aHexWeiAmount = '0x33f29d8041';

  beforeEach(() => {
    amount = new AmountOf(aWeiAmount, usdcToken);
  });

  it('new', () => {
    expect(amount).toBeTruthy();
  });

  it('value access', () => {
    expect(amount.value()).toEqual(anAmount);
  });

  it('wei access', () => {
    expect(amount.weiValue()).toEqual(aWeiAmount);
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

  it('value in hex', () => {
    amount = new AmountOf(aHexWeiAmount, usdcToken);
    expect(amount.value()).toEqual(223113.740353);
  });

  it('times in hex', () => {
    const aHexMultiplier = '0x5208';

    amount = new AmountOf(aHexWeiAmount, usdcToken);
    expect(amount.times(aHexMultiplier).value()).toEqual(4685388547.413);
  });
});

describe('NullAmountOf', () => {
  const amount = new NullAmountOf();

  it('new', () => {
    expect(amount).toBeTruthy();
  });

  it('json', () => {
    expect(amount.json().value).toEqual(undefined);
    expect(amount.json().token).toEqual(undefined);
  });
});
