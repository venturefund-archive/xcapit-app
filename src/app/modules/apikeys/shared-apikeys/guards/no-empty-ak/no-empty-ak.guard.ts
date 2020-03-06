import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ApiUsuariosService } from 'src/app/modules/usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoEmptyAKGuard implements CanActivate {
  constructor(
    private apiUsuariosService: ApiUsuariosService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.apiUsuariosService.status().pipe(
      map(data => {
        if (data.empty_linked_keys) {
          this.router.navigate(['funds/fund-name']);
        }
        return !data.empty_linked_keys;
      })
    );
  }
}
