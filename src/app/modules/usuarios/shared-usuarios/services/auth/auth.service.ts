import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { AUTH } from 'src/app/config/app-constants.config';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new ReplaySubject<any>(1);
  isLoggedIn = new ReplaySubject<boolean>(1);

  constructor(
    private storage: Storage,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
    this.checkLogin();
  }

  async checkLogin() {
    const isValidToken = await this.checkToken();
    if (isValidToken) {
      this.user.next(await this.getUserLogged());
      this.isLoggedIn.next(true);
    } else {
      this.logout();
    }
  }

  async logout(): Promise<void> {
    this.user.next(null);
    this.isLoggedIn.next(false);
    await this.storage.remove(AUTH.storageKey);
    await this.storage.remove(AUTH.userKey);
  }

  async handleLoginResponse(response: any) {
    await this.storage.set(AUTH.storageKey, response.access);
    await this.storage.set(AUTH.userKey, JSON.stringify(response.usuario));
    this.isLoggedIn.next(true);
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

  async sesionExpired() {
    await this.logout();
    this.router.navigate(['/users/login']);
  }
}
