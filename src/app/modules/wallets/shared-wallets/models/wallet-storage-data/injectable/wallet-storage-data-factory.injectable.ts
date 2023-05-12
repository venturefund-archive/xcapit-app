import { Injectable } from '@angular/core';
import { IonicStorageService } from '../../../../../../shared/services/ionic-storage/ionic-storage.service';
import { WalletStorageDataFactory } from '../factory/wallet-storage-data-factory';

@Injectable({ providedIn: 'root' })
export class WalletStorageDataFactoryInjectable {
  constructor(private _aStorage: IonicStorageService) {}

  public create(): WalletStorageDataFactory {
    return new WalletStorageDataFactory(this._aStorage);
  }
}
