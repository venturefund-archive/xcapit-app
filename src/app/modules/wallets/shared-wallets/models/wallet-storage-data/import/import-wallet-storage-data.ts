import { WalletStorageData } from '../wallet-storage-data.interface';
import { StorageService } from '../../../../../../shared/services/app-storage/app-storage.service';

export class ImportWalletStorageData implements WalletStorageData {
  constructor(
    private readonly _aWalletStorageData: WalletStorageData,
    private readonly _aStorageService: StorageService
  ) {}

  async save(): Promise<void> {
    await this._aWalletStorageData.save();
    await this._saveProtectedWallet();
  }

  private async _saveProtectedWallet(): Promise<void> {
    await this._aStorageService.set('protectedWallet', true);
  }
}
