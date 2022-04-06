import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiUsuariosService } from 'src/app/modules/usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UserStatusGuard implements CanActivate {
  constructor(private apiUsers: ApiUsuariosService, private navController: NavController) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | boolean {
    return this.apiUsers.status().pipe(
      map((res) => {
        if (res.status_name === 'BEGINNER' || res.status_name === 'CREATOR') {
          this.navController.navigateForward(['/apikeys/list'], {
            replaceUrl: true,
          });
        }
        return res.status_name === 'EXPLORER' || res.status_name === 'COMPLETE';
      })
    );
  }
}
