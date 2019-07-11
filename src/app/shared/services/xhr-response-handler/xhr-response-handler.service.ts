import { Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG } from 'src/app/config/app-constants.config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class XhrResponseHandlerService {

  private allow5xxErrors: boolean;

  constructor(private toastService: ToastService, private translate: TranslateService) {
    this.allow5xxErrors = !environment.production;
  }

  error(defaultMessage?: string) {
    return (response: HttpErrorResponse) => {
      const message = this.getMessage(defaultMessage, response);
      this.toastService.showToast({ message, duration: 8000 });
      return throwError(response);
    };
  }

  private getMessage(
    defaultMessage: string,
    response: HttpErrorResponse
  ): string {
    if (
      response.status !== 0 &&
      this.shouldShowDefaultMessage(response.status)
    ) {
      return (
        defaultMessage ||
        (typeof response.error === 'string' && response.error) ||
        (typeof response.error === 'object' && typeof response.error.error === 'string' && response.error.error) ||
        (typeof response.error === 'object' && typeof response.error.detail === 'string' && response.error.detail) ||
        (response.error instanceof ArrayBuffer &&
          JSON.parse(
            String.fromCharCode.apply(null, new Uint8Array(response.error))
          )) ||
        response.message ||
        this.translate.instant(CONFIG.xhrResponseHandlerService.defaultMessage)
      );
    } else {
      return this.translate.instant(CONFIG.xhrResponseHandlerService.defaultMessage);
    }
  }

  private shouldShowDefaultMessage(statusCode: number) {
    return this.allow5xxErrors ? true : statusCode < 500;
  }
}
