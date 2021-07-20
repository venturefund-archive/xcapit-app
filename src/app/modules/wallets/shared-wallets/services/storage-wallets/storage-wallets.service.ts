import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageWalletsService {
  constructor(private storage: Storage) {}

  async setValue(key: string, value: any): Promise<void> {
    return this.storage.set(key, value);
  }

  async getValue(key: string): Promise<any> {
    return this.storage.get(key);
  }

  async hasAcceptedToS(): Promise<boolean> {
    return new Promise((resolve) => {
      this.getValue('userAcceptedToS').then((v) => resolve(v === true));
    });
  }

  async acceptToS(): Promise<void> {
    return this.setValue('userAcceptedToS', true);
  }
}
