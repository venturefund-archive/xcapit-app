import { WalletStorageData } from '../wallet-storage-data.interface';
import { FakeWalletStorageData } from '../fake/fake-wallet-storage-data';
import { ImportWalletStorageData } from './import-wallet-storage-data';
import { FakeAppStorage, StorageService } from '../../../../../../shared/services/app-storage/app-storage.service';

describe('ImportWalletStorageData', () => {
  let walletStorageData: WalletStorageData;
  let storage: StorageService;

  beforeEach(() => {
    storage = new FakeAppStorage();
    walletStorageData = new ImportWalletStorageData(new FakeWalletStorageData(), storage);
  });

  it('new', () => {
    expect(walletStorageData).toBeTruthy();
  });

  it('save', async () => {
    await walletStorageData.save();
    expect(await storage.get('protectedWallet')).toEqual(true);
  });
});
