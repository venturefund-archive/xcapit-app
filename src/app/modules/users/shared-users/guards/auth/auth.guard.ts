import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { LoggedIn } from '../../models/logged-in/logged-in';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private ionicStorageService: IonicStorageService,
    private storageService: StorageService,
    private navController: NavController
  ) {}

  async canActivate(): Promise<boolean> {
    const isLoggedIn = !!(await new LoggedIn(this.ionicStorageService).value());
    const hasWallet = !!(await this.storageService.getWalletFromStorage());
    if (!isLoggedIn || !hasWallet) {
      this.goToOnboarding();
    }
    return isLoggedIn && hasWallet;
  }

  private goToOnboarding() {
    this.navController.navigateForward('/users/on-boarding');
  }
}
