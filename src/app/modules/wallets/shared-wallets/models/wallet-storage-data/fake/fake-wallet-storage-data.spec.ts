import { WalletStorageData } from '../wallet-storage-data.interface';
import { FakeWalletStorageData } from './fake-wallet-storage-data';

describe('FakeWalletStorageData', () => {
  let walletStorageData: WalletStorageData;
  beforeEach(() => {
    walletStorageData = new FakeWalletStorageData();
  });

  it('new', () => {
    expect(walletStorageData).toBeTruthy();
  });

  it('save', async () => {
    await expectAsync(walletStorageData.save()).toBeResolved();
  });
});
