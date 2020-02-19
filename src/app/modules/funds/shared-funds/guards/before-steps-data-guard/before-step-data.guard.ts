import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { FundDataStorageService } from '../../services/fund-data-storage/fund-data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BeforeStepDataGuard implements CanActivate {
  constructor(
    private fundDataStorage: FundDataStorageService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const can = await this.fundDataStorage.canActivatePage(state.url);
    if (!can) {
      this.router.navigate(['funds/fund-name']);
    }
    return can;
  }
}
