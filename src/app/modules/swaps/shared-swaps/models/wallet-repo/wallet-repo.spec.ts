import { FakeAppStorage } from 'src/app/shared/services/app-storage/app-storage.service';
import { rawStoredWalletData, rawStoredWalletDataNew } from '../fixtures/raw-stored-wallet-data';
import { WalletRepo } from './wallet-repo';

describe('Wallet Repo', () => {
  let repo: WalletRepo;

  beforeEach(() => {
    repo = new WalletRepo(new FakeAppStorage(rawStoredWalletDataNew));
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
    const repo = new WalletRepo(new FakeAppStorage());

    await repo.save(rawStoredWalletDataNew.enc_wallet.addresses, rawStoredWalletDataNew.enc_wallet.wallet);

    expect(await repo.addressByName('MATIC')).toEqual(rawStoredWalletDataNew.enc_wallet.addresses.MATIC);
  });

  it('creation method', async () => {
    expect(await repo.creationMethod()).toEqual('default');
  });

  it('creation method legacy', async () => {
    repo = new WalletRepo(new FakeAppStorage(rawStoredWalletData));
    expect(await repo.creationMethod()).toEqual('legacy');
  });
});
