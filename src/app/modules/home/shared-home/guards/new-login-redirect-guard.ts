import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

@Injectable({
  providedIn: 'root',
})
export class NewLoginRedirectGuard implements CanActivate {
  constructor(private navController: NavController, private remoteConfigService: RemoteConfigService) {}

  async canActivate(): Promise<boolean> {
    const isffEnabled = this.isFeatureFlagEnabled();
    if (isffEnabled) this.redirectToWallet();
    return !isffEnabled;
  }

  isFeatureFlagEnabled() {
    return this.remoteConfigService.getFeatureFlag('ff_newLogin');
  }

  private redirectToWallet() {
    this.navController.navigateForward(['tabs/wallets']);
  }
}
