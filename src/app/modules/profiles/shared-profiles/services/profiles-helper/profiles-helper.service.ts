import { Injectable } from '@angular/core';
import { ApiProfilesService } from '../api-profiles/api-profiles.service';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ProfilesHelperService {
  constructor(
    private apiProfiles: ApiProfilesService,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
  }

  private fromGuard: boolean;

  private urlToAccess: string;

  getUrlToAccess(): string {
    return this.urlToAccess;
  }

  isFromGuard(): boolean {
    return this.fromGuard;
  }

  isFromGuardHasBeenCalled() {
    this.fromGuard = false;
    this.urlToAccess = '';
  }

  isProfileDataOk(urlToAccess: string): Observable<boolean> {
    this.urlToAccess = urlToAccess;
    return this.apiProfiles.profileValid('personal_data').pipe(
      map(res => {
        if (!res.valid) {
          this.fromGuard = true;
          this.navController.navigateForward(['/profiles/user']).then(() =>
            this.toastService.showToast({
              message: this.translate.instant(this.getToastMessage())
            })
          );
        }
        return res.valid;
      })
    );
  }

  getToastMessage() {
    switch (this.urlToAccess) {
      case '/referrals/new':
        return 'profiles.profile_helper.from_new_referral_data_no_ok';
      case '/funds/action/new':
        return 'profiles.profile_helper.from_new_fund_data_no_ok';
      default:
        return 'profiles.profile_helper.data_no_ok';
    }
  }
}
