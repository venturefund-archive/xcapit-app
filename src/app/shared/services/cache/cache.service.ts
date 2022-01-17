import { IonicStorageService } from './../ionic-storage/ionic-storage.service';
import { Injectable } from '@angular/core';
import { CONFIG } from '../../../config/app-constants.config';
import add from 'date-fns/add';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  constructor(private storage: IonicStorageService) {}

  private addPrefix(key: string): string {
    return `${CONFIG.cache.PREFIX}${key}`;
  }

  private expirationDate(): number {
    return add(this.now(), { seconds: CONFIG.cache.TTL }).getTime();
  }

  private now(): number {
    return new Date().getTime();
  }

  private isExpired(timestamp: string): boolean {
    return this.now() > parseInt(timestamp);
  }

  update(key: string, value: any): Promise<any> {
    return this.storage.set(this.addPrefix(key), Object.assign(value, { expiration_date: this.expirationDate() }));
  }

  async get(key: string): Promise<any> {
    const storedValue = await this.storage.get(this.addPrefix(key));

    if (storedValue && !this.isExpired(storedValue.expiration_date)) {
      return storedValue;
    } else {
      await this.storage.remove(this.addPrefix(key));
    }
  }
}
