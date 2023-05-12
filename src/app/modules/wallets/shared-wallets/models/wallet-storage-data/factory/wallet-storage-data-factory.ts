import { StorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { WalletStorageData } from '../wallet-storage-data.interface';
import { DefaultWalletStorageData } from '../default/default-wallet-storage-data';
import { ImportWalletStorageData } from '../import/import-wallet-storage-data';
import { DriveWalletStorageData } from '../drive/drive-wallet-storage-data';

export class WalletStorageDataFactory {
  private _walletStorageDataClasses = new Map<string, any>([
    ['import', new ImportWalletStorageData(new DefaultWalletStorageData(this._aStorageService), this._aStorageService)],
    ['create', new DefaultWalletStorageData(this._aStorageService)],
    [
      'drive',
      new DriveWalletStorageData(
        new ImportWalletStorageData(new DefaultWalletStorageData(this._aStorageService), this._aStorageService),
        this._aStorageService
      ),
    ],
  ]);
  constructor(private readonly _aStorageService: StorageService) {}

  oneBy(aMode: string): WalletStorageData {
    return this._walletStorageDataClasses.get(aMode);
  }
}
