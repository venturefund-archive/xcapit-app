import { StorageService } from 'src/app/shared/services/app-storage/app-storage.service';

export class SimplifiedWallet {
  constructor(private _storage: StorageService, private _storageKey: string = 'warranty_wallet') {}

  public save(aValue: boolean): Promise<void> {
    return this._storage.set(this._storageKey, aValue);
  }

  public value(): Promise<boolean> {
    return this._storage.get(this._storageKey);
  }
}
