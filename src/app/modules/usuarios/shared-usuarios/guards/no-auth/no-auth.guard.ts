import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private navController: NavController) {}

  async canActivate(): Promise<boolean> {
    const isValid = await this.authService.checkToken();
    if (isValid) {
      await this.navController.navigateRoot(['/tabs/funds']);
    }
    return !isValid;
  }
}
