import { WeiOf } from '../../../../../../shared/models/wei-of/wei-of';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApproveTx } from './approve-tx';
import { TransactionRequest } from '@ethersproject/abstract-provider';

describe('ApproveTx', () => {
  let approveTx: ApproveTx;

  beforeEach(() => {
    approveTx = new ApproveTx(
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      new WeiOf(10, { decimals: 6 } as Coin)
    );
  });

  it('new', () => {
    expect(approveTx).toBeTruthy();
  });

  it('value', async () => {
    expect(await approveTx.value()).toEqual({
      data: '0x095ea7b3000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000989680',
      to: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    } as TransactionRequest);
  });
});
