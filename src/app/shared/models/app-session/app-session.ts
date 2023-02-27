import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { FakeAppStorage } from '../../services/app-storage/app-storage.service';
import { IonicStorageService } from '../../services/ionic-storage/ionic-storage.service';
import { AppExpirationTimeService } from './injectable/app-expiration-time.service';

export class AppSession {
  private readonly _storageKey: string = '_xcp_app_session_created_time';
  private readonly _sessionExpirationTime: string = '_xcp_app_session_expiration_time';

  constructor(
    private readonly storage: IonicStorageService | FakeAppStorage,
    private readonly walletStorage: StorageService,
    private _aTime: number,
    private readonly expirationTimeService: AppExpirationTimeService
  ) {}

  public save(): void {
    this.storage.set(this._storageKey, new Date().valueOf());
  }

  public setSessionExpirationTime(time: number): void {
    this.storage.set(this._sessionExpirationTime, time);
  }

  public async valid(): Promise<boolean> {
    if (!await this._hasWallet()) return true;
    
    return (await this._timeActive()) < (await this._time());
  }

  private _storageValue(): Promise<any> {
    return this.storage.get(this._storageKey);
  }

  private async _hasWallet(): Promise<boolean> {
    return !!(await this.walletStorage.getWalletFromStorage());
  }

  private async _timeActive(): Promise<number> {
    return Math.abs(new Date().valueOf() - (await this._storageValue())) / (1000 * 60);
  }

  private async _time(): Promise<number> {
    this._aTime = await this.expirationTimeService.get();
    return this._aTime;
  }
}
