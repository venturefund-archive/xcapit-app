import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private navController: NavController) {}

  async canActivate(): Promise<boolean> {
    let isValid = await this.authService.checkToken();
    if (isValid) {
      await this.goToFundsPage();
    } else {
      isValid = await this.authService.checkRefreshToken();
      if (isValid) {
        await this.goToFundsPage();
      }
    }
    return !isValid;
  }

  async goToFundsPage() {
    return await this.navController.navigateRoot(['/tabs/funds']);
  }
}
