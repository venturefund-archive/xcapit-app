import { Injectable } from '@angular/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { DefaultBiometricAuth } from '../default/default-biometric-auth';
import { BiometricAuth } from '../biometric-auth.interface';
import { TranslateService } from '@ngx-translate/core';
import { BiometricVerifyOptions } from '../../biometric-verify-options/biometric-verify-options';

@Injectable({ providedIn: 'root' })
export class BiometricAuthInjectable {
  private _defaultOptions = {
    title: this.translate.instant('profiles.biometric_auth.options.title'),
    subtitle: this.translate.instant('profiles.biometric_auth.options.subtitle')
  }
  constructor(private translate: TranslateService, private storage: IonicStorageService) {}
  public create(): BiometricAuth {
    return new DefaultBiometricAuth(this.storage, new BiometricVerifyOptions(this._defaultOptions));
  }
}
