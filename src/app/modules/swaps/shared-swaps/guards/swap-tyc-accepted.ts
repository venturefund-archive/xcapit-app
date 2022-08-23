import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SwapTYCAccepted implements CanActivate {
  constructor(private navController: NavController, private storage: IonicStorageService) {}

  async canActivate(): Promise<boolean> {
    const tycAccepted = !!(await this.storage.get('termsAndConditions1InchSwapAccepted'));
    if (!tycAccepted) this.redirectToTermsAndConditions();
    return tycAccepted;
  }

  private redirectToTermsAndConditions() {
    this.navController.navigateForward(['swaps/swap-terms-and-conditions']);
  }
}
