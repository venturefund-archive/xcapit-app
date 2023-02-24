import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

@Injectable({
  providedIn: 'root',
})
export class NewLogin implements CanActivate {
  private readonly defaultRoute = '/users/login-new';
  
  constructor(private remoteConfigService: RemoteConfigService, private navController: NavController) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    if (this.isFeatureFlagEnabled()) {
      const url = route.data.redirectUrl ? route.data.redirectUrl : this.defaultRoute;
      await this.redirectTo(url);     
    }

    return !this.isFeatureFlagEnabled();
  }

  private isFeatureFlagEnabled(): boolean {
    return this.remoteConfigService.getFeatureFlag('ff_newLogin');
  }

  private redirectTo(url: string): Promise<boolean> {
    return this.navController.navigateRoot([url]);
  } 
}
