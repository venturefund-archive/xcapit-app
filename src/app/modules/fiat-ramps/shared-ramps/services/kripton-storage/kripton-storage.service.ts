import { Injectable } from '@angular/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Injectable({ providedIn: 'root' })
export class KriptonStorageService {
  private prefix = 'kripton';
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

  async removeCredentials(): Promise<void> {
    await this.remove('email');
    await this.remove('user_status');
    await this.remove('refresh_token');
    await this.remove('access_token');
  }

  async renewTokens(access_token: string, refresh_token: string) {
    await this.set('access_token', access_token);
    await this.set('refresh_token', refresh_token);
  }
}
