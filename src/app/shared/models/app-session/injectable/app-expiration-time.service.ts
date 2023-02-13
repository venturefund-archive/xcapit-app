import { Injectable } from '@angular/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Injectable({ providedIn: 'root' })
export class AppExpirationTimeService {
  private readonly _sessionExpirationTime: string = '_xcp_app_session_expiration_time';
  private isModalEnabled = true;
  constructor(private storage: IonicStorageService) {}

  public async get(): Promise<number> {
    const sessionTime = await this.storage.get(this._sessionExpirationTime);
    if (sessionTime === null) {
      this.set(2);
      return 2;
    }
    return sessionTime;
  }

  public set(value: number): Promise<void> {
    return this.storage.set(this._sessionExpirationTime, value);
  }

  public getModalAvailability(): boolean {
    return this.isModalEnabled;
  }

  public enableExpirationModal() {
    this.isModalEnabled = true;
  }

  public disableExpirationModal() {
    this.isModalEnabled = false;
  }
}
