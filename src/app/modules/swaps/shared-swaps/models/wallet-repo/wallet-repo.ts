import { StorageService } from "src/app/shared/services/app-storage/app-storage.service";


export class WalletRepo {

  private readonly _storageKey = 'enc_wallet';

  constructor(private _anStorage: StorageService) { }

  async addressByName(aBlockchainName: string): Promise<any> {
    return (await this._storedData()).addresses[aBlockchainName];
  }

  async encryptedRootWallet(): Promise<any> {
    return (await this._storedData()).wallet;
  }

  private async _storedData(): Promise<any> {
    return await this._anStorage.get(this._storageKey);
  }
}
