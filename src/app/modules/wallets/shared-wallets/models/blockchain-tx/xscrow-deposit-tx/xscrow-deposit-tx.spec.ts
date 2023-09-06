import { WeiOf } from '../../../../../../shared/models/wei-of/wei-of';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { XscrowDepositTx } from './xscrow-deposit-tx';

describe('XscrowDepositTx', () => {
  let xscrowDepositTx: XscrowDepositTx;

  beforeEach(() => {
    xscrowDepositTx = new XscrowDepositTx(
      new WeiOf(1, { decimals: 18 } as Coin),
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    );
  });

  it('new', () => {
    expect(xscrowDepositTx).toBeTruthy();
  });

  it('value', async () => {
    expect(await xscrowDepositTx.value()).toEqual({
      data: '0xb6b55f250000000000000000000000000000000000000000000000000de0b6b3a7640000',
      to: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    });
  });
});
