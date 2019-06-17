import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): Promise<boolean> {
    return this.authService.checkToken().then(isValid => {
      if (!isValid) {
        this.authService.sesionExpired();
      }
      return isValid;
    });
  }
}
