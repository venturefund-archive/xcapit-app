import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CreatedWalletGuard implements CanActivate {
  constructor(private navController: NavController, private appStorageService: AppStorageService) {}

  async canActivate(): Promise<boolean> {
    const hasCreatedWallet = await this.hasCreatedWallet();

    if (hasCreatedWallet) await this.redirectToToSPage();

    return hasCreatedWallet === null;
  }

  async hasCreatedWallet(): Promise<boolean> {
    return await this.appStorageService.get('enc_wallet');
  }

  async redirectToToSPage() {
    return await this.navController.navigateRoot(['tabs/wallets']);
  }
}
