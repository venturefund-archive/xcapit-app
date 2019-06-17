import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { AUTH, CONFIG } from 'src/app/config/app-constants.config';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new ReplaySubject<any>(1);

  constructor(
    private storage: Storage,
    private jwtHelper: JwtHelperService,
    private toastService: ToastService,
    private router: Router
    ) {
      this.checkLogin();
    }

  async checkLogin() {
    const isValidToken = await this.checkToken();
    if (isValidToken) {
      this.user.next(await this.getUserLogged());
    } else {
      this.logout();
    }
  }

  logout() {
    this.user.next(null);
    this.storage.remove(AUTH.storageKey);
    this.storage.remove(AUTH.userKey);
  }

  async handleLoginResponse(response: any) {
    await this.storage.set(AUTH.storageKey, response.access);
    await this.storage.set(AUTH.userKey, JSON.stringify(response.usuario));
    this.user.next(response.usuario);
    return response.jwt;
  }

  async checkToken(): Promise<boolean> {
    const jwt = await this.storage.get(AUTH.storageKey);
    return jwt && !this.jwtHelper.isTokenExpired(jwt);
  }

  private async getUserLogged() {
    const user = await this.storage.get(AUTH.userKey);
    return JSON.parse(user);
  }

  sesionExpired() {
    this.logout();
    this.router.navigate(['/users/login']);
  }
}
