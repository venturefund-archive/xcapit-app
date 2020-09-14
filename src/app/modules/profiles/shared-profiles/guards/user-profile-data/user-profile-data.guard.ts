import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfilesHelperService } from '../../services/profiles-helper/profiles-helper.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileDataGuard implements CanActivate {
  constructor(private profilesHelper: ProfilesHelperService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.profilesHelper.isProfileDataOk(state.url);
  }
}
