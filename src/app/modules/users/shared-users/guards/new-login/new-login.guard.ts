import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NewLogin implements CanActivate {
  constructor(private remoteConfigService: RemoteConfigService, private navController: NavController) {}

  async canActivate(): Promise<boolean> {
    const isffEnabled = this.isFeatureFlagEnabled();
    
    if (isffEnabled) await this.redirectToOnBoardingPage();

    return !isffEnabled;
  }

  isFeatureFlagEnabled() {
    return this.remoteConfigService.getFeatureFlag('ff_newLogin');
  }

  async redirectToOnBoardingPage() {
    return await this.navController.navigateRoot(['users/on-boarding']);
  }
}
