import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

export class LoggedIn {
  constructor(private _storage: IonicStorageService, private _storageKey: string = 'loggedIn') {}

  public save(aValue: boolean): Promise<void> {
    return this._storage.set(this._storageKey, aValue);
  }

  public value(): Promise<boolean> {
    return this._storage.get(this._storageKey);
  }
}
