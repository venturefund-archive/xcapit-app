import { StorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { DataRepo } from './data-repo.interface';

export class WalletRepo implements DataRepo {
  private readonly _storageKey = 'enc_wallet';

  constructor(private _anStorage: StorageService) {}

  async addressByName(aBlockchainName: string): Promise<string> {
    return (await this._storedData()).addresses[aBlockchainName];
  }

  async encryptedRootWallet(): Promise<string> {
    return (await this._storedData()).wallet;
  }

  async save(addresses: any, encryptedWallet: string): Promise<void> {
    await this._anStorage.set(this._storageKey, { addresses, wallet: encryptedWallet });
  }

  private async _storedData(): Promise<any> {
    return await this._anStorage.get(this._storageKey);
  }
}
