import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {AUTH} from 'src/app/config/app-constants.config';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';
import {CRUD} from 'src/app/shared/services/crud/crud';
import {CrudService} from 'src/app/shared/services/crud/crud.service';
import {CustomHttpService} from 'src/app/shared/services/custom-http/custom-http.service';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AppStorageService} from 'src/app/shared/services/app-storage/app-storage.service';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new ReplaySubject<any>(1);
    isLoggedIn = new ReplaySubject<boolean>(1);
    crud: CRUD;
    entity = 'users';

    constructor(
        private storage: AppStorageService,
        private jwtHelper: JwtHelperService,
        private router: Router,
        private crudService: CrudService,
        private http: CustomHttpService,
    ) {
        this.checkLogin();
        this.crud = this.crudService.getEndpoints('users');
    }

    async storedToken(): Promise<string> {
        return await this.storage.get(AUTH.storageKey);
    }

    async checkLogin() {
        const isValidToken = await this.checkToken();
        if (isValidToken) {
            await this.dispatchLogin();
        } else {
            this.checkRefreshToken().then(async isRefreshed => {
                isRefreshed ? await this.dispatchLogin() : await this.logout();
            });
        }
    }

    private async dispatchLogin() {
        this.user.next(await this.getUserLogged());
        this.isLoggedIn.next(true);
    }

    async logout(): Promise<void> {
        this.user.next(null);
        this.isLoggedIn.next(false);
        await this.storage.remove(AUTH.storageKey);
        await this.storage.remove(AUTH.userKey);
        await this.storage.remove(AUTH.refreshKey);
    }

    async handleLoginResponse(response: any) {
        await this.saveAuth(response);
        this.isLoggedIn.next(true);
        this.user.next(response.usuario);
        return response.jwt;
    }

    async handleRefreshResponse(response: any) {
        await this.saveAuth(response);
        this.isLoggedIn.next(true);
        this.user.next(response.usuario);
        return response.jwt;
    }

    private async saveAuth(response: any) {
        await this.storage.set(AUTH.storageKey, response.access);
        await this.storage.set(AUTH.refreshKey, response.refresh);
        await this.storage.set(AUTH.userKey, response.usuario);
    }

    async checkToken(): Promise<boolean> {
        const jwt = await this.storage.get(AUTH.storageKey);
        return jwt && !this.jwtHelper.isTokenExpired(jwt);
    }

    async isTokenExpired(): Promise<boolean> {
        const jwt = await this.storage.get(AUTH.storageKey);
        return this.jwtHelper.isTokenExpired(jwt);
    }

    async checkRefreshToken(): Promise<boolean> {
        const jwtRefresh = await this.storage.get(AUTH.refreshKey);
        if (jwtRefresh && !this.jwtHelper.isTokenExpired(jwtRefresh)) {
            const jwtRefreshJSON = JSON.parse(`{"refresh" : "${jwtRefresh}"}`);
            await this.refreshToken(jwtRefreshJSON).toPromise();
            return true;
        } else {
            return false;
        }
    }

    refreshToken(data: any): Observable<any> {
        return this.http
            .post(`${environment.apiUrl}/${this.entity}/refresh_token`, data)
            .pipe(tap(response => this.handleRefreshResponse(response)));
    }

    private async getUserLogged() {
        return await this.storage.get(AUTH.userKey);
    }

    async sesionExpired() {
        await this.logout();
        await this.router.navigate(['/users/login']);
    }
}
