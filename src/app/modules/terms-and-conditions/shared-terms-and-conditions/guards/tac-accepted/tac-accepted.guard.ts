import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TacHelperService } from '../../services/tac-helper/tac-helper.service';

@Injectable({
  providedIn: 'root'
})
export class TacAcceptedGuard implements CanActivate {
  constructor(private tacHelperService: TacHelperService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.tacHelperService.isTaCAccepted(state.url);
  }
}
