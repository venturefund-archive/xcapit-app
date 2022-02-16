import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';

@Injectable({
  providedIn: 'root',
})
export class HasWalletToBuyGuard implements CanActivate {
  constructor(private navController: NavController, private storageService: StorageService) {}

  async canActivate(): Promise<boolean> {
    const walletExist = await this.walletExist();

    if (!walletExist) await this.redirect();

    return !!walletExist;
  }

  walletExist(): Promise<boolean> {
    return this.storageService.getWalletFromStorage();
  }

  redirect() {
    return this.navController.navigateForward(['/fiat-ramps/no-wallet-to-buy']);
  }
}
