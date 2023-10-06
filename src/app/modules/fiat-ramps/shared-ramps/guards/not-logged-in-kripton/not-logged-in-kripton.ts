import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { KriptonUserInjectable } from '../../models/kripton-user/injectable/kripton-user.injectable';

@Injectable({ providedIn: 'root' })
export class NotLoggedInKriptonGuard {
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
