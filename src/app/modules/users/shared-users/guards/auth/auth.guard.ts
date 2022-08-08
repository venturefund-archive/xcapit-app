import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private remoteConfigService: RemoteConfigService) {}

  async canActivate(): Promise<boolean> {
    const isffEnabled = await this.isFeatureFlagEnabled()
    if (!isffEnabled) {
      return this.authService.checkToken().then((isValid) => {
        if (!isValid) {
          this.authService.checkRefreshToken().then(async (isRefreshed) => {
            if (!isRefreshed) {
              await this.authService.sesionExpired();
            }
          });
        }
        return isValid;
      });
    }
    return isffEnabled;
  }

  isFeatureFlagEnabled() {
    return this.remoteConfigService.getFeatureFlag('ff_newLogin');
  }
}
