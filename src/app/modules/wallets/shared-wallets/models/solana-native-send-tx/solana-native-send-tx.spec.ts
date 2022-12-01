import { FakeWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { SolanaNativeSendTx } from './solana-native-send-tx';

describe('SolanaNativeSendTx', () => {
  let transaction: SolanaNativeSendTx;
  const testToAddress = 'HVGoaJgWW9TEu19avGRPjc2KvmReUYwxXib7NmwQqm4F';
  const testWalletAddress = 'iuwtfpp8yzDrJNQbHXBSufSCZKhGctw5bQFAx23VgBH';

  beforeEach(() => {
    transaction = new SolanaNativeSendTx(
      new FakeWallet(Promise.resolve(false), null, testWalletAddress),
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
