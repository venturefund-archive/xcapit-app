import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  capacitor = Capacitor;

  constructor() {}

  isWeb() {
    return this.capacitor.platform === 'web';
  }

  isNative() {
    return this.capacitor.isNative;
  }
}
