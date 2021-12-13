import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class IsSubscribedGuard implements CanActivate {
  constructor(private apiFunds: ApiFundsService, private navController: NavController) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | boolean {
    const fundName = next.paramMap.get('fundName');
    if (!fundName) {
      return true;
    }
    return this.apiFunds.isSubscribed(next.paramMap.get('fundName')).pipe(
      map((res) => {
        if (!res.is_subscribed) {
          this.navController.navigateBack(['/tabs/investments/binance'], {
            replaceUrl: true,
          });
        }
        return res.is_subscribed;
      })
    );
  }
}
