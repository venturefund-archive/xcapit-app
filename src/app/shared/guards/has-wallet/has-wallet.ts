import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';

@Injectable({
  providedIn: 'root',
})
export class HasWallet {
  private defaultFallbackUrl = '/wallets/no-wallet';
  constructor(private navController: NavController, private storageService: StorageService) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return this.walletExist().then((exists) => {
      if (!exists) this.redirect(route.data.hasWalletFallbackUrl);
      return exists;
    });
  }

  walletExist(): Promise<boolean> {
    return this.storageService.getWalletFromStorage().then((wallet) => !!wallet);
  }

  redirect(fallbackUrl: string) {
    return this.navController.navigateForward([fallbackUrl ?? this.defaultFallbackUrl]);
  }
}
