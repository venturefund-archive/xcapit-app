import { FakeWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { NativeSendTxOf } from './native-send-tx-of';

fdescribe('NativeSendTxOf', () => {
  const testWalletAddress = 'iuwtfpp8yzDrJNQbHXBSufSCZKhGctw5bQFAx23VgBH';
  let transaction: NativeSendTxOf;

  beforeEach(() => {
    transaction = new NativeSendTxOf(
      new FakeWallet(Promise.resolve(false), '', testWalletAddress),
      'iuwtfpp8yzDrJNQbHXBSufSCZKhGctw5bQFAx23VgBH',
      1
    );
  });

  it('new', () => {
    expect(transaction).toBeTruthy();
  });

  it('value', async () => {
    expect(await transaction.value()).toBeTruthy();
  });
});
