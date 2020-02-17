import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { StorageApikeysService } from '../../services/storage-apikeys/storage-apikeys.service';

@Injectable({
  providedIn: 'root'
})
export class ApiKeyDataGuard implements CanActivate {
  constructor(
    private storageApikeysService: StorageApikeysService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    console.log(this.storageApikeysService.valid);
    if (this.storageApikeysService.valid) {
      return of(true);
    } else {
      this.router.navigate(['apikeys/tutorial']);
      return of(false);
    }
  }
}
