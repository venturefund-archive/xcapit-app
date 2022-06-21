import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root',
})
export class AppStorageService {
  storage = Storage;
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

  public set(key, value): Promise<void> {
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
