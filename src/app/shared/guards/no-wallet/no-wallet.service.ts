import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';

@Injectable({
  providedIn: 'root',
})
export class NoWallet implements CanActivate {
  private defaultFallbackUrl = '/users/login-new';
  constructor(private navController: NavController, private storageService: StorageService) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return this.walletExist().then((exists) => {
      console.log('exists', exists);
      if (exists) this.redirect(route.data.noWalletFallbackUrl);
      return !exists;
    });
  }

  walletExist(): Promise<boolean> {
    return this.storageService.getWalletFromStorage().then((wallet) => !!wallet);
  }

  redirect(fallbackUrl: string) {
    return this.navController.navigateForward([fallbackUrl ?? this.defaultFallbackUrl]);
  }
}
