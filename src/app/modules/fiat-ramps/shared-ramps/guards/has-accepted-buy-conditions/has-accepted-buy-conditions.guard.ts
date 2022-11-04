import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Injectable({
  providedIn: 'root'
})
export class HasAcceptedBuyConditionsGuard implements CanActivate {
  private readonly _aKey = 'conditionsPurchasesAccepted';

  constructor(private ionicStorage: IonicStorageService, private navController: NavController) {}

  async canActivate(): Promise<boolean> {
    const result = !!(await this.ionicStorage.get(this._aKey));

    if (!result) {
      await this.goToConditions();
    }

    return result;
  }

  private goToConditions() {
    return this.navController.navigateForward(['/fiat-ramps/buy-conditions']);
  }
  
}
