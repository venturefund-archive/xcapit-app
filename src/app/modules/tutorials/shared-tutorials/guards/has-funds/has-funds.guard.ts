import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiUsuariosService } from 'src/app/modules/usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HasFundsGuard implements CanActivate {
  constructor(
    private apiUsuariosService: ApiUsuariosService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.apiUsuariosService.hasFunds().pipe(
      map(data => {
        if (data.has_funds) {
          this.router.navigate(['/tabs/funds']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
