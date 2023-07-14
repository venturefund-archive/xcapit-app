import { Injectable } from '@angular/core';
import { IonicStorageService } from '../../../../../../shared/services/ionic-storage/ionic-storage.service';
import { WalletStorageDataFactory } from '../factory/wallet-storage-data-factory';
import { ApiProfilesService } from 'src/app/modules/profiles/shared-profiles/services/api-profiles/api-profiles.service';

@Injectable({ providedIn: 'root' })
export class WalletStorageDataFactoryInjectable {
  constructor(private _aStorage: IonicStorageService, private _aProfileService: ApiProfilesService) {}

  public create(): WalletStorageDataFactory {
    return new WalletStorageDataFactory(this._aStorage, this._aProfileService);
  }
}
