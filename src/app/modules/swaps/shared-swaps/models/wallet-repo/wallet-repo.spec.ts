import { FakeAppStorage } from 'src/app/shared/services/app-storage/app-storage.service';
import { rawStoredWalletData } from '../fixtures/raw-stored-wallet-data';
import { WalletRepo } from './wallet-repo';

describe('Wallet Repo', () => {
  let repo: WalletRepo;

  beforeEach(() => {
    repo = new WalletRepo(new FakeAppStorage(rawStoredWalletData));
  });

  it('new', () => {
    expect(new WalletRepo(new FakeAppStorage())).toBeTruthy();
  });

  it('get by blockchain name', async () => {
    expect(await repo.addressByName('MATIC')).toEqual(rawStoredWalletData.enc_wallet.addresses.MATIC);
  });

  it('encrypted value access', async () => {
    expect(await repo.encryptedRootWallet()).toEqual(rawStoredWalletData.enc_wallet.wallet);
  });

  it('save', async () => {
    const repo = new WalletRepo(new FakeAppStorage());

    await repo.save(
      rawStoredWalletData.enc_wallet.addresses,
      rawStoredWalletData.enc_wallet.wallet
    );

    expect(await repo.addressByName('MATIC')).toEqual(rawStoredWalletData.enc_wallet.addresses.MATIC);
  });
});
