import { Injectable } from '@angular/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { AppSession } from '../app-session';
import { AppExpirationTimeService } from './app-expiration-time.service';

@Injectable({ providedIn: 'root' })
export class AppSessionInjectable {
  constructor(private storage: IonicStorageService, private sessionExpirationTime: AppExpirationTimeService) {}

  create(time?: number, storage: IonicStorageService = this.storage, sessionExpirationTime: AppExpirationTimeService = this.sessionExpirationTime): AppSession {
    return new AppSession(storage, time, sessionExpirationTime);
  }
}
