import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import {structuredClone} from '../../utils/structured-clone';

export interface StorageService {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<any>;
}

@Injectable({
  providedIn: 'root',
})
export class AppStorageService implements StorageService {
  storage = Preferences;
  windowStorage = window.localStorage;

  constructor() {
    this.storage.migrate().then();
  }

  static securedJSONParse(value: any) {
    let fixedValue;
    try {
      fixedValue = JSON.parse(value);
    } catch (e) {
      fixedValue = value;
    }
    return fixedValue;
  }

  public async get(key: string): Promise<any> {
    return AppStorageService.securedJSONParse((await this.storage.get({ key })).value);
  }

  public set(key: string, value: any): Promise<void> {
    const fixValue = typeof value === 'string' ? value : JSON.stringify(value);
    return this.storage.set({ key, value: fixValue });
  }

  public remove(key: string): Promise<void> {
    return this.storage.remove({ key });
  }

  public forceRemove(key: string): void {
    return this.windowStorage.removeItem(key);
  }
}

export class FakeAppStorage implements StorageService {
  private _aFakeStorageValueCopy: any;
  constructor(private readonly _aFakeStorageValue: any = {}) {
    this._aFakeStorageValueCopy = structuredClone(_aFakeStorageValue);
  }

  async get(aStorageKey: string): Promise<any> {
    return this._aFakeStorageValueCopy[aStorageKey];
  }

  async set(key: string, value: any): Promise<any> {
    this._aFakeStorageValueCopy[key] = value;
  }
}
