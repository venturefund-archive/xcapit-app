import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FiatRampsService } from 'src/app/modules/fiat-ramps/shared-ramps/services/fiat-ramps.service';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UserHasOperationsGuard {
  constructor(private fiatRamps: FiatRampsService, private navController: NavController) {}

  canActivate(): Observable<boolean | UrlTree> | boolean {
    return this.fiatRamps.userHasOperations().pipe(
      map((res) => {
        if (!res.user_has_operations) {
          this.navController.navigateForward(['/fiat-ramps/new-operation/moonpay']);
        }
        return res.user_has_operations;
      })
    );
  }
}
