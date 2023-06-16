import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { KriptonUserInjectable } from '../../models/kripton-user/injectable/kripton-user.injectable';
import { RegistrationStatus } from '../../../enums/registration-status.enum';

@Injectable({ providedIn: 'root' })
export class KriptonKycCompletedGuard implements CanActivate {
  constructor(private kriptonUser: KriptonUserInjectable, private navController: NavController) {}

  async canActivate(): Promise<boolean> {
    const userStatus = await this.kriptonUser.create().userStatus();
    if (userStatus !== 'COMPLETE') {
      const redirection = RegistrationStatus[userStatus];
      this.navController.navigateForward(redirection);
      return false;
    }
    return true;
  }
}
