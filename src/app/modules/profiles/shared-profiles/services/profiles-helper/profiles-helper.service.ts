import { Injectable } from '@angular/core';
import { ApiProfilesService } from '../api-profiles/api-profiles.service';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilesHelperService {
  constructor(
    private apiProfiles: ApiProfilesService,
    private navController: NavController,
    private toastService: ToastService
  ) {}

  private fromGuard: boolean;

  isFromGuard(): boolean {
    return this.fromGuard;
  }

  isProfileDataOk(): Observable<boolean> {
    return this.apiProfiles.crud.get().pipe(
      map(profileData => {
        let isDataOk = true;
        for (const key in profileData) {
          if (profileData[key] === '') {
            isDataOk = false;
          }
        }
        if (!isDataOk) {
          this.fromGuard = true;
          this.navController.navigateForward(['profiles/user']).then(() =>
            this.toastService.showToast({
              message:
                'Debe completar sus datos personales para poder crear un fondo'
            })
          );
        }
        return isDataOk;
      })
    );
  }
}
