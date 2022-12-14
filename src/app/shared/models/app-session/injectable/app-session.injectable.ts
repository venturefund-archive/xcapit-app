import { Injectable } from '@angular/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { AppSession } from '../app-session';

@Injectable({ providedIn: 'root' })
export class AppSessionInjectable {
  constructor(private storage: IonicStorageService) {}

  create(storage: IonicStorageService = this.storage, time: number = 2): AppSession {
    return new AppSession(storage, time);
  }
}
