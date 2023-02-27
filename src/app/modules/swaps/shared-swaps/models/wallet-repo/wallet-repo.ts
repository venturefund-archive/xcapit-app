import { StorageWallet } from 'src/app/modules/wallets/shared-wallets/interfaces/storage-wallet.interface';
import { StorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { WalletCreationMethod } from 'src/app/shared/types/wallet-creation-method.type';
import { DataRepo } from './data-repo.interface';

export class WalletRepo implements DataRepo {
  private readonly _storageKey = 'enc_wallet';

  constructor(private _anStorage: StorageService) {}

  async creationMethod(): Promise<WalletCreationMethod> {
    const creationMethod = (await this.storedData()).creationMethod;

    return creationMethod ? creationMethod : 'legacy';
  }

  async addressByName(aBlockchainName: string): Promise<string> {
    return (await this.storedData()).addresses[aBlockchainName];
  }

  async encryptedRootWallet(): Promise<string> {
    return (await this.storedData()).wallet;
  }

  async save(addresses: any, encryptedWallet: string): Promise<void> {
    const wallet = await this.storedData();
    await this._anStorage.set(
      this._storageKey,
      wallet ? { ...wallet, addresses } : { wallet: encryptedWallet, addresses }
    );
  }

  public async storedData(): Promise<StorageWallet> {
    return await this._anStorage.get(this._storageKey);
  }
}
