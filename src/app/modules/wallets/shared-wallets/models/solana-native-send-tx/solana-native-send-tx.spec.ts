import { FakeWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { NativeSendTxOf } from './solana-native-send-tx';

fdescribe('NativeSendTxOf', () => {
  let transaction: NativeSendTxOf;
  const testToAddress = 'HVGoaJgWW9TEu19avGRPjc2KvmReUYwxXib7NmwQqm4F';
  const testWalletAddress = 'iuwtfpp8yzDrJNQbHXBSufSCZKhGctw5bQFAx23VgBH';

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
