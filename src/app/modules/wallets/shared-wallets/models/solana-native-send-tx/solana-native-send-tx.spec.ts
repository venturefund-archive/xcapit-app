import { FakeWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { solanaAddresses } from '../../fixtures/raw-address-data';
import { SolanaNativeSendTx } from './solana-native-send-tx';

fdescribe('SolanaNativeSendTx', () => {
  let transaction: SolanaNativeSendTx;
  const testToAddress = solanaAddresses[0];
  const testWalletAddress = solanaAddresses[1];

  beforeEach(() => {
    transaction = new SolanaNativeSendTx(
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
