import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { AUTH } from 'src/app/config/app-constants.config';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new ReplaySubject<any>(1);
  isLoggedIn = new ReplaySubject<boolean>(1);
  crud: CRUD;
  entity = 'users';

  constructor(
    private storage: Storage,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private crudService: CrudService,
    private http: CustomHttpService
  ) {
    this.checkLogin();
    this.crud = this.crudService.getEndpoints('users');
  }

  async checkLogin() {
    const isValidToken = await this.checkToken();
    if (isValidToken) {
      this.user.next(await this.getUserLogged());
      this.isLoggedIn.next(true);
    } else {
      this.checkRefreshToken().then((isRefreshed) => {
        if (isRefreshed) {
          this.user.next(this.getUserLogged());
          this.isLoggedIn.next(true);
        } else {
          this.logout();
        }
      });
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
    await this.storage.set(AUTH.refreshKey, response.refresh);
    await this.storage.set(AUTH.userKey, JSON.stringify(response.usuario));
    this.isLoggedIn.next(true);
    this.user.next(response.usuario);
    return response.jwt;
  }

  async handleRefreshResponse(response: any) {
    await this.storage.set(AUTH.storageKey, response.access);
    await this.storage.set(AUTH.refreshKey, response.refresh);
    await this.storage.set(AUTH.userKey, JSON.stringify(response.usuario));
    this.isLoggedIn.next(true);
    this.user.next(response.usuario);
    return response.jwt;
  }

  async checkToken(): Promise<boolean> {
    const jwt = await this.storage.get(AUTH.storageKey);
    return jwt && !this.jwtHelper.isTokenExpired(jwt);
  }

  async checkRefreshToken(): Promise<boolean> {
    const jwtRefresh = await this.storage.get(AUTH.refreshKey);
    if (jwtRefresh && !this.jwtHelper.isTokenExpired(jwtRefresh)) {
      const jwtRefreshJSON = JSON.parse(`{"refresh" : "${jwtRefresh}"}`);
      await this.refreshToken(jwtRefreshJSON).subscribe();
      return true;
    } else {
      return false;
    }
  }

  refreshToken(data: any): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/${this.entity}/refresh_token`, data)
      .pipe(tap((response) => this.handleRefreshResponse(response)));
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
