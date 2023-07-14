import { WalletStorageDataFactory } from '../factory/wallet-storage-data-factory';
import { WalletStorageDataFactoryInjectable } from './wallet-storage-data-factory.injectable';

describe('WalletStorageDataFactoryInjectable', () => {
  let walletStorageDataFactoryInjectable: WalletStorageDataFactoryInjectable;

  beforeEach(() => {
    walletStorageDataFactoryInjectable = new WalletStorageDataFactoryInjectable(null, null);
  });

  it('new', () => {
    expect(walletStorageDataFactoryInjectable).toBeTruthy();
  });

  it('createRequest and request', async () => {
    expect(walletStorageDataFactoryInjectable.create()).toBeInstanceOf(WalletStorageDataFactory);
  });
});
