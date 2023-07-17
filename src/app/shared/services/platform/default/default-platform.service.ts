import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PlatformService } from '../platform-service.interface';

@Injectable({
  providedIn: 'root',
})
export class DefaultPlatformService implements PlatformService {
  capacitor = Capacitor;

  constructor() {}

  isWeb(): boolean {
    return this.capacitor.getPlatform() === 'web';
  }

  isNative(): boolean {
    return this.capacitor.isNativePlatform();
  }

  platform(): string {
    return this.capacitor.getPlatform();
  }
}
