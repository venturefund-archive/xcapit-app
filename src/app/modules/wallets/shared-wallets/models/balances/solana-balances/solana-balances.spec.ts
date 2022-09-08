import { TEST_SOLANA_COINS } from '../../../constants/coins.test';
import { SolanaBalances } from './solana-balances';

describe('SolanaBalances', () => {
  let solanaBalances: SolanaBalances;

  beforeEach(() => {
    solanaBalances = new SolanaBalances('11111111111111111111111111111111', TEST_SOLANA_COINS, 'https://test');
  });

  it('new', () => {
    expect(solanaBalances).toBeTruthy();
  });

  it('valueOf', async () => {
    spyOn(solanaBalances._connection, 'getBalance').and.returnValue(Promise.resolve(2));
    expect(await solanaBalances.valueOf(TEST_SOLANA_COINS[0])).toEqual({balance:2e-9, coin: TEST_SOLANA_COINS[0]});
  });

  it('value', async () => {
    spyOn(solanaBalances._connection, 'getBalance').and.returnValue(Promise.resolve(2));
    expect(await solanaBalances.value()).toEqual([{balance:2e-9, coin: TEST_SOLANA_COINS[0]}]);
  });
});
