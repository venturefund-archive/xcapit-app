import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FiatRampsService } from 'src/app/modules/fiat-ramps/shared-ramps/services/fiat-ramps.service';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserHasOperationsGuard implements CanActivate {
  constructor(
    private fiatRamps: FiatRampsService,
    private navController: NavController
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | boolean {
    return this.fiatRamps.userHasOperations().pipe(
      map(res => {
        if (!res.user_has_operations) {
          this.navController.navigateForward(['/fiat-ramps/select-provider'], {
            replaceUrl: true
          });
        }
        return res.user_has_operations;
      })
    );
  }
}
