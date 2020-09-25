import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from 'src/app/modules/usuarios/shared-usuarios/services/auth/auth.service';
import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';

@Injectable({
  providedIn: 'root'
})
export class SubscribeGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionsService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return this.authService.checkToken().then(isValid => {
      if (!isValid) {
        this.authService.checkRefreshToken().then(isRefreshed => {
          if (!isRefreshed) {
            this.subscriptionService.saveLinkData({
              subscriptionToken: route.firstChild.paramMap.get('subscriptionToken'),
              fundNameb64: route.firstChild.paramMap.get('fundNameb64')
            });
          this.authService.sesionExpired();
          }
        });
      }
      return isValid;
    });
  }
}
