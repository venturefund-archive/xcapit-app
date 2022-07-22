import { Injectable } from '@angular/core';
import { IonicStorageService } from '../../../../../shared/services/ionic-storage/ionic-storage.service';

@Injectable({
  providedIn: 'root',
})
export class XAuthService {
  private key = 'x-auth';

  constructor(private storage: IonicStorageService) {}

  async token(): Promise<string | null> {
    return await this.storage.get(this.key);
  }

  async saveToken(token: string): Promise<void> {
    return this.storage.set(this.key, token);
  }

  public header(): string {
    return this.key;
  }
}
