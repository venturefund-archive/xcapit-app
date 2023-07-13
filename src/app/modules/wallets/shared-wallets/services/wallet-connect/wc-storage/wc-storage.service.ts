import { Injectable } from '@angular/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Injectable({ providedIn: 'root' })
export class WCStorageService {
  private prefix = 'wc';
  constructor(private storage: IonicStorageService) {}

  private addPrefix(key: string): string {
    return `${this.prefix}_${key}`;
  }

  set(key: string, value: any): Promise<any> {
    return this.storage.set(this.addPrefix(key), value);
  }

  get(key: string): Promise<any> {
    return this.storage.get(this.addPrefix(key));
  }

  remove(key: string): Promise<any> {
    return this.storage.remove(this.addPrefix(key));
  }
}
