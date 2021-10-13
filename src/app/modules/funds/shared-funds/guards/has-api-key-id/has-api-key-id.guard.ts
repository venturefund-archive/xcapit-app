import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageApikeysService } from '../../../../apikeys/shared-apikeys/services/storage-apikeys/storage-apikeys.service';

@Injectable({
  providedIn: 'root',
})
export class HasApiKeyIdGuard implements CanActivate {
  constructor(private storageApiKeysService: StorageApikeysService) {}

  canActivate(): Observable<boolean | UrlTree> | boolean {
    return !!this.storageApiKeysService.data.id;
  }
}
