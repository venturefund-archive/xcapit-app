import { FakeWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { NativeSendTxOf } from './native-send-tx-of';

fdescribe('NativeSendTxOf', () => {
  const testWalletAddress = 'iuwtfpp8yzDrJNQbHXBSufSCZKhGctw5bQFAx23VgBH';
  const testToAddress = 'HVGoaJgWW9TEu19avGRPjc2KvmReUYwxXib7NmwQqm4F';
  let transaction: NativeSendTxOf;

  beforeEach(() => {
    transaction = new NativeSendTxOf(
      new FakeWallet(Promise.resolve(false), '', testWalletAddress),
      testToAddress,
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
