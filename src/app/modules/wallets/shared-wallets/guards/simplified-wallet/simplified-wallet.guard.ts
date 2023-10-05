import { Injectable, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SimplifiedWallet } from '../../models/simplified-wallet/simplified-wallet';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SimplifiedWalletGuardService  {
  constructor(private _aStorage: IonicStorageService, private navController: NavController) {}

  async canActivate(): Promise<boolean> {
    const hasSimplifiedWallet = await new SimplifiedWallet(this._aStorage).value();
    if (hasSimplifiedWallet) await this.redirectToPage();
    return !hasSimplifiedWallet;
  }

  async redirectToPage() {
    return await this.navController.navigateRoot(['/simplified-home-wallet']);
  }
}

export const SimplifiedWalletGuard: CanActivateFn = async () => {
  return inject(SimplifiedWalletGuardService).canActivate();
};

