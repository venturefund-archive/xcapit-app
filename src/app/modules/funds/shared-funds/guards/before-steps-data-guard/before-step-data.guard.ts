import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FundDataStorageService } from '../../services/fund-data-storage/fund-data-storage.service';

@Injectable({
  providedIn: 'root',
})
export class BeforeStepDataGuard implements CanActivate {
  constructor(private fundDataStorage: FundDataStorageService, private navController: NavController) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const can = await this.fundDataStorage.canActivatePage(state.url);
    if (!can) {
      this.navController.navigateRoot(['/apikeys/list']);
    }
    return can;
  }
}
