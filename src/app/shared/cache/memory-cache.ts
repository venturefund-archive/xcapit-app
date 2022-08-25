import { ExpirableValue } from "./expirable-value";


export class MemoryCache {
  private _memoryStorage: Map<string, ExpirableValue> = new Map<string, ExpirableValue>();

  constructor(private _ttlInSeconds: number = 1000) {}

  getValueBy(aKey: string): any {
    return this._memoryStorage.get(aKey)?.value();
  }

  setBy(aKey: string, aValue: any) {
    this._memoryStorage.set(aKey, new ExpirableValue(aValue, this._ttlInSeconds));
  }

  has(aKey: string): boolean {
    return this._memoryStorage.has(aKey) && !this._hasExpired(aKey);
  }

  private _hasExpired(aKey: string) {
    const value = this._memoryStorage.get(aKey);
    const hasExpired = value?.expired();
    if (hasExpired) {
      this._memoryStorage.delete(aKey);
    }
    return hasExpired;
  }
}
