import { FakeBalances } from '../../balances/fake-balances/fake-balances';
import { FakePrices } from '../../token-prices/fake-prices';
import { Coin } from '../../../interfaces/coin.interface';
import { TotalBalance } from './total-balance';
import { FakeBalance } from '../fake-balance/fake-balance';

fdescribe('TotalBalance', () => {
  let maticSpy: jasmine.SpyObj<Coin>;
  let usdcSpy: jasmine.SpyObj<Coin>;

  beforeEach(() => {
    maticSpy = jasmine.createSpyObj('MATIC', {}, { value: 'MATIC', network: 'MATIC' });
    usdcSpy = jasmine.createSpyObj('USDC', {}, { value: 'USDC', network: 'MATIC' });
  });

  it('should new', () => {
    expect(new TotalBalance(new FakePrices(), new FakeBalances(), new FakeBalance(5))).toBeTruthy();
  });

  it('should get value', async () => {
    expect(
      await new TotalBalance(
        new FakePrices({ MATIC: 2, USDC: 1 }),
        new FakeBalances([
          { balance: 5, coin: maticSpy },
          { balance: 10, coin: usdcSpy },
        ]),
        new FakeBalance(5)
      ).value()
    ).toEqual(25);
  });
});
