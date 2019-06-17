import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfilesHelperService } from '../../services/profiles-helper/profiles-helper.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileDataGuard implements CanActivate {
  constructor(private profilesHelper: ProfilesHelperService) {}

  canActivate(): Observable<boolean> {
    return this.profilesHelper.isProfileDataOk();
  }
}
