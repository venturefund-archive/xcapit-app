import { WalletStorageData } from "../wallet-storage-data.interface";
import { StorageService } from "src/app/shared/services/app-storage/app-storage.service";

export class DriveWalletStorageData implements WalletStorageData {
    constructor(
      private readonly _aWalletStorageData: WalletStorageData,
      private readonly _aStorageService: StorageService
    ) {}

    async save(): Promise<void> {
      await this._aWalletStorageData.save();
      await this._saveWalletBackup()
    }

    private async _saveWalletBackup(): Promise<void>{
      await this._aStorageService.set('wallet_backup', true);
    }
  }
