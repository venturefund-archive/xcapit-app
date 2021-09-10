import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';

@Injectable({
  providedIn: 'root',
})
export class CreatedWalletGuard implements CanActivate {
  constructor(private navController: NavController, private storageService: StorageService) {}

  async canActivate(): Promise<boolean> {
    const hasCreatedWallet = await this.hasCreatedWallet();

    if (hasCreatedWallet) await this.redirectToToSPage();

    return hasCreatedWallet === null;
  }

  async hasCreatedWallet(): Promise<boolean> {
    return await this.storageService.getWalletFromStorage();
  }

  async redirectToToSPage() {
    return await this.navController.navigateRoot(['tabs/wallets']);
  }
}
