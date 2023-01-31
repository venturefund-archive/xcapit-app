import { FakeAppStorage } from '../../services/app-storage/app-storage.service';
import { IonicStorageService } from '../../services/ionic-storage/ionic-storage.service';
import { AppExpirationTimeService } from './injectable/app-expiration-time.service';

export class AppSession {
  private readonly _storageKey: string = '_xcp_app_session_created_time';
  private readonly _sessionExpirationTime: string = '_xcp_app_session_expiration_time';

  constructor(private readonly storage: IonicStorageService | FakeAppStorage, private _aTime: number, private readonly expirationTimeService: AppExpirationTimeService) {}

  public save(): void {
    this.storage.set(this._storageKey, new Date().valueOf());
  }

  public setSessionExpirationTime(time: number): void {
    this.storage.set(this._sessionExpirationTime, time);
  }

  public async valid(): Promise<boolean> {
    console.log('time set for session expiration (minutes): ', await this._time())
    console.log('time elapsed since background to focus (minutes): ', await this._timeActive())
    console.log('should the session expire?: ', !((await this._timeActive()) < await this._time()))
    return (await this._timeActive()) < await this._time();
  }

  private _storageValue(): Promise<any> {
    return this.storage.get(this._storageKey);
  }

  private async _timeActive(): Promise<number> {
    return Math.abs(new Date().valueOf() - (await this._storageValue())) / (1000 * 60);
  }

  private async _time(): Promise<number> {
    this._aTime = await this.expirationTimeService.get();
    console.log('expirationTimeService value set, new value: ', await this.expirationTimeService.get())
    return this._aTime;
  }
}
