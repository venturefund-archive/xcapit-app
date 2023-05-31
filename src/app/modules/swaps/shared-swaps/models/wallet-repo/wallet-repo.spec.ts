import { AppStorageService, FakeAppStorage } from 'src/app/shared/services/app-storage/app-storage.service';
import { rawStoredWalletData, rawStoredWalletDataNew } from '../fixtures/raw-stored-wallet-data';
import { WalletRepo } from './wallet-repo';

describe('Wallet Repo', () => {
  let repo: WalletRepo;
  let storageSpy: jasmine.SpyObj<AppStorageService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', {
      get: Promise.resolve(rawStoredWalletDataNew.enc_wallet),
      set: Promise.resolve(),
    });
    repo = new WalletRepo(storageSpy);
  });

  it('new', () => {
    expect(new WalletRepo(new FakeAppStorage())).toBeTruthy();
  });

  it('get by blockchain name', async () => {
    expect(await repo.addressByName('MATIC')).toEqual(rawStoredWalletDataNew.enc_wallet.addresses.MATIC);
  });

  it('encrypted value access', async () => {
    expect(await repo.encryptedRootWallet()).toEqual(rawStoredWalletDataNew.enc_wallet.wallet);
  });

  it('save', async () => {
    await repo.save(rawStoredWalletDataNew.enc_wallet.addresses, rawStoredWalletDataNew.enc_wallet.wallet);

    expect(storageSpy.set).toHaveBeenCalledOnceWith('enc_wallet', {
      addresses: rawStoredWalletDataNew.enc_wallet.addresses,
      wallet: rawStoredWalletDataNew.enc_wallet.wallet,
    });
  });

  it('update without storage', async () => {
    storageSpy.get.and.returnValue(Promise.resolve(undefined));

    await repo.update(rawStoredWalletDataNew.enc_wallet.addresses, rawStoredWalletDataNew.enc_wallet.wallet);

    expect(storageSpy.set).toHaveBeenCalledOnceWith('enc_wallet', {
      addresses: rawStoredWalletDataNew.enc_wallet.addresses,
      wallet: rawStoredWalletDataNew.enc_wallet.wallet,
    });
  });

  it('update', async () => {
    storageSpy.get.and.returnValue(Promise.resolve({ alias: 'testAlias' }));

    await repo.update(rawStoredWalletDataNew.enc_wallet.addresses, rawStoredWalletDataNew.enc_wallet.wallet);

    expect(storageSpy.set).toHaveBeenCalledOnceWith('enc_wallet', {
      alias: 'testAlias',
      addresses: rawStoredWalletDataNew.enc_wallet.addresses,
      wallet: rawStoredWalletDataNew.enc_wallet.wallet,
    });
  });

  it('creation method', async () => {
    expect(await repo.creationMethod()).toEqual('default');
  });

  it('creation method legacy', async () => {
    storageSpy.get.and.resolveTo(rawStoredWalletData.enc_wallet);
    expect(await repo.creationMethod()).toEqual('legacy');
  });
});
