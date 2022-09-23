import { Injectable } from '@angular/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { DefaultBiometricAuth } from '../default/default-biometric-auth';
import { BiometricAuth } from '../biometric-auth.interface';

@Injectable({ providedIn: 'root' })
export class BiometricAuthInjectable {
  constructor(private storage: IonicStorageService) {}
  public create(): BiometricAuth {
    return new DefaultBiometricAuth(this.storage);
  }
}
