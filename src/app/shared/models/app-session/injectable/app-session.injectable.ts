import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { AppSession } from '../app-session';
import { AppExpirationTimeService } from './app-expiration-time.service';

@Injectable({ providedIn: 'root' })
export class AppSessionInjectable {
  constructor(private storage: IonicStorageService, private walletStorageService: StorageService, private sessionExpirationTime: AppExpirationTimeService) {}

  create(time?: number, storage: IonicStorageService = this.storage, walletStorageService: StorageService = this.walletStorageService, sessionExpirationTime: AppExpirationTimeService = this.sessionExpirationTime): AppSession {
    return new AppSession(storage, walletStorageService, time, sessionExpirationTime);
  }
}
