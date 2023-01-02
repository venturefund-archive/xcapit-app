import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { NavController } from "@ionic/angular";
import { KriptonUserInjectable } from "../../models/kripton-user/injectable/kripton-user.injectable";

@Injectable({ providedIn: 'root' })
export class KriptonKycCompletedGuard implements CanActivate {
  private readonly kycStepsUrl = '/fiat-ramps/user-register';

  constructor(private kriptonUser: KriptonUserInjectable, private navController: NavController) {}

  async canActivate(): Promise<boolean> {
    if (await this.kriptonUser.create().userStatus() !== 'COMPLETE') {
      this.navController.navigateForward(this.kycStepsUrl);
      return false;
    }
    return true;
  }
}