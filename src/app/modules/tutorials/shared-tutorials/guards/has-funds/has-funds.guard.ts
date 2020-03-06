import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';

@Injectable({
  providedIn: 'root'
})
export class HasFundsGuard implements CanActivate {
  constructor(
    private apiFundsService: ApiFundsService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.apiFundsService.count().pipe(
      map(data => {
        if (data.owners > 0 || data.not_owner > 0) {
          this.router.navigate(['/tabs/funds']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
