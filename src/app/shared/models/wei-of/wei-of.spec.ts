import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { BigNumber } from 'ethers';
import { WeiOf } from './wei-of';

describe('WeiOf', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  let weiOf: WeiOf;

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { decimals: 6 });
    weiOf = new WeiOf(1, coinSpy);
  });

  it('new', () => {
    expect(weiOf).toBeTruthy();
  });

  it('value', () => {
    expect(weiOf.value()).toEqual(BigNumber.from('1000000'));
  });
});
