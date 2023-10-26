import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { LoggedIn } from '../../models/logged-in/logged-in';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard {
  constructor(private ionicStorageService: IonicStorageService, private navController: NavController) {}

  async canActivate(): Promise<boolean> {
    const isLoggedIn = !!(await new LoggedIn(this.ionicStorageService).value());
    if (isLoggedIn) {
      this.goToWalletHome();
    }
    return !isLoggedIn;
  }

  private goToWalletHome() {
    this.navController.navigateForward('/tabs/wallets');
  }
}
