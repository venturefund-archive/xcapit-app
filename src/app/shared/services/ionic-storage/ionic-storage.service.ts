import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from '../app-storage/app-storage.service';
@Injectable({
  providedIn: 'root',
})
export class IonicStorageService implements StorageService{
  constructor(private storage: Storage) {}

  set(key: string, value: any): Promise<any> {
    return this.storage.set(key, value);
  }

  get(key: string): Promise<any> {
    return this.storage.get(key);
  }

  remove(key: string): Promise<any> {
    return this.storage.remove(key);
  }

  clear(): Promise<any> {
    return this.storage.clear();
  }
}
