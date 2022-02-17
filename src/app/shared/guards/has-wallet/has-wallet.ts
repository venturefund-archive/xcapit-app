import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';

@Injectable({
  providedIn: 'root',
})
export class HasWallet implements CanActivate {
  constructor(private navController: NavController, private storageService: StorageService) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const fallbackUrl: string = route.data.hasWalletFallbackUrl ?? '/wallets/no-wallet';
    const walletExist = await this.walletExist();
    if (!walletExist) await this.redirect(fallbackUrl);

    return !!walletExist;
  }

  walletExist(): Promise<boolean> {
    return this.storageService.getWalletFromStorage();
  }

  redirect(fallbackUrl: string) {
    return this.navController.navigateForward([fallbackUrl]);
  }
}
