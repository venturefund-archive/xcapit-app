import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { KriptonUserInjectable } from '../../models/kripton-user/injectable/kripton-user.injectable';

@Injectable({ providedIn: 'root' })
export class NotLoggedInKriptonGuard implements CanActivate {
  private readonly loggedUrl = '/fiat-ramps/purchases';

  constructor(private kriptonUser: KriptonUserInjectable, private navController: NavController) {}

  async canActivate(): Promise<boolean> {
    if (await this.kriptonUser.create().isLogged()) {
      this.navController.navigateForward(this.loggedUrl);
      return false;
    }
    return true;
  }
}
