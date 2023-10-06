import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { KriptonUserInjectable } from '../../models/kripton-user/injectable/kripton-user.injectable';

@Injectable({ providedIn: 'root' })
export class LoggedInKriptonGuard {
  private readonly notLoggedUrl = '/fiat-ramps/user-email';

  constructor(private kriptonUser: KriptonUserInjectable, private navController: NavController) {}

  async canActivate(): Promise<boolean> {
    if (!(await this.kriptonUser.create().isLogged())) {
      this.navController.navigateForward(this.notLoggedUrl);
      return false;
    }
    return true;
  }
}
