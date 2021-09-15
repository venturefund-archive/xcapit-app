import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { StorageApikeysService } from '../../services/storage-apikeys/storage-apikeys.service';

@Injectable({
  providedIn: 'root',
})
export class ApiKeyDataGuard implements CanActivate {
  constructor(private storageApikeysService: StorageApikeysService, private router: Router) {}

  canActivate(): Observable<boolean> {
    if (this.storageApikeysService.data) {
      return of(true);
    } else {
      this.router.navigate(['apikeys/tutorial/exchange']);
      return of(false);
    }
  }
}
