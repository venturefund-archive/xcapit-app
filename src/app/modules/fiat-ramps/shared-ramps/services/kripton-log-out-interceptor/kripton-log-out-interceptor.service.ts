import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { KriptonStorageService } from '../kripton-storage/kripton-storage.service';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { WHITELIST } from './whitelist-kripton-interceptor';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { FiatRampsService } from '../fiat-ramps.service';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable({ providedIn: 'root' })
export class KriptonLogOutInterceptorService implements HttpInterceptor {
  private readonly _prefix = `${this.env.byKey('apiUrl')}/on_off_ramps/provider`;

  constructor(
    private storage: KriptonStorageService,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService,
    private env: EnvService,
    private fiatRampsService: FiatRampsService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        return this._checkEndpoint(error)
          ? fromPromise(this._refreshTokens()).pipe(
              mergeMap(({ access_token, refresh_token }) => {
                this._saveTokens(access_token, refresh_token);
                return next.handle(this.clonedRequest(req, access_token));
              }),
              catchError((error: HttpErrorResponse) => {
                this._logOutKripton();
                return throwError(error);
              })
            )
          : throwError(error);
      })
    );
  }

  private _checkEndpoint(httpErrorResponse: HttpErrorResponse): boolean {
    for (const endpoint of WHITELIST) {
      if (
        httpErrorResponse.url.startsWith(this._createUrl(endpoint.url)) &&
        httpErrorResponse.status === endpoint.httpCode
      ) {
        return true;
      }
    }
    return false;
  }

  private async _refreshTokens(): Promise<{ access_token: string; refresh_token: string }> {
    return this.fiatRampsService.refreshToken(await this._getTokens()).toPromise();
  }

  private async _saveTokens(access_token: string, refresh_token: string) {
    await this.storage.renewTokens(access_token, refresh_token);
  }

  private async _logOutKripton() {
    await this.storage.removeCredentials();
    await this.navController.navigateRoot(['/tabs/wallets']);
    await this.toastService.showWarningToast({
      message: this.translate.instant('shared.services.kripton_interceptor.session_expired_toast'),
    });
  }

  private _createUrl(url: string) {
    return `${this._prefix}/${url}`;
  }

  private async _getTokens() {
    return {
      access_token: await this.storage.get('access_token'),
      refresh_token: await this.storage.get('refresh_token'),
    };
  }

  clonedRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
    const body = Object.assign({ auth_token: token }, req.body);
    return req.clone({ body });
  }
}
