import { FakePrices } from './fake-prices';
import { Coin } from '../../interfaces/coin.interface';

describe('FakePrices', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  beforeEach(()=>{
    coinSpy=jasmine.createSpyObj('Coin', {}, {value: 'MATIC'});
  })

  it('new', () => {
    expect(new FakePrices({})).toBeTruthy();
  });

  it('value', async () => {
    expect(await new FakePrices().value()).toEqual({});
  });
  it('valueOf', async () => {
    expect(await new FakePrices({MATIC: 2}).valueOf(coinSpy)).toEqual(2);
  });
});
