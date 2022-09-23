import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

@Injectable({
  providedIn: 'root',
})
export class NewLoginTickets implements CanActivate {
  constructor(private remoteConfigService: RemoteConfigService, private navController: NavController) {}

  async canActivate(): Promise<boolean> {
    const isffEnabled = this.isFeatureFlagEnabled();
    
    if (isffEnabled) await this.redirectToNewLogin();

    return !isffEnabled;
  }

  isFeatureFlagEnabled() {
    return this.remoteConfigService.getFeatureFlag('ff_newLogin');
  }

  async redirectToNewLogin() {
    return await this.navController.navigateForward(['/tickets/new-create-support-ticket']);
  }
}
