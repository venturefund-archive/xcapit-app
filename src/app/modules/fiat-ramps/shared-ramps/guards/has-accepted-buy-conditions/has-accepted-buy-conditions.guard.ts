import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SimplifiedWallet } from 'src/app/modules/wallets/shared-wallets/models/simplified-wallet/simplified-wallet';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Injectable({
  providedIn: 'root',
})
export class HasAcceptedBuyConditionsGuard implements CanActivate {
  private readonly _aKey = 'conditionsPurchasesAccepted';

  constructor(private ionicStorage: IonicStorageService, private navController: NavController) {}

  async canActivate(): Promise<boolean> {
    const termsAndConditionsAccepted = !!(await this.ionicStorage.get(this._aKey));

    if (await this._isSimplifiedWallet()) {
      await this.goToPurchases();
    } else if (!termsAndConditionsAccepted) {
      await this.goToConditions();
    }
    return true;
  }

  private goToConditions() {
    return this.navController.navigateForward(['/fiat-ramps/buy-conditions']);
  }

  private goToPurchases() {
    return this.navController.navigateForward(['/fiat-ramps/purchases']);
  }

  private _isSimplifiedWallet() {
    return new SimplifiedWallet(this.ionicStorage).value();
  }
}
