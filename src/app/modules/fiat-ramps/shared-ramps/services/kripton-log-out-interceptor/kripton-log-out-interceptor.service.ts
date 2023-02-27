import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KriptonStorageService } from '../kripton-storage/kripton-storage.service';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { WHITELIST } from './whitelist-kripton-interceptor';
import { EnvService } from 'src/app/shared/services/env/env.service';

@Injectable({ providedIn: 'root' })
export class KriptonLogOutInterceptorService implements HttpInterceptor {
  private readonly _prefix = `${this.env.byKey('apiUrl')}/on_off_ramps/provider`;

  constructor(
    private storage: KriptonStorageService,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService,
    private env: EnvService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((error) => this._handleError(error)));
  }

  private _handleError(httpErrorResponse: HttpErrorResponse): Observable<any> {
    for (const endpoint of WHITELIST) {
      if (
        httpErrorResponse.url.startsWith(this._createUrl(endpoint.url)) &&
        httpErrorResponse.status === endpoint.httpCode
      ) {
        return from(this._logOutKripton());
      }
    }
    return throwError(httpErrorResponse);
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
}
