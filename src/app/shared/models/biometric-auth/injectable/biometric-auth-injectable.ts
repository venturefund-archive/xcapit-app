import { Injectable } from '@angular/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { DefaultBiometricAuth } from '../default/default-biometric-auth';
import { BiometricAuth } from '../biometric-auth.interface';
import { TranslateService } from '@ngx-translate/core';
import { BiometricVerifyOptions } from '../../biometric-verify-options/biometric-verify-options';

@Injectable({ providedIn: 'root' })
export class BiometricAuthInjectable {
  constructor(private translate: TranslateService, private storage: IonicStorageService) {}
  public create(verifyOptions: BiometricVerifyOptions = new BiometricVerifyOptions(this.translate)): BiometricAuth {
    return new DefaultBiometricAuth(this.storage, verifyOptions);
  }
}
