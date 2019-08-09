import { Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG } from 'src/app/config/app-constants.config';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  handle(response) {
    let message = '';
    if (response.error.error_code) {
      // Error code
      message = this.translate.instant(
        `errorCodes.${response.error.error_code}`
      );
    } else {
      // Default
      message = this.translate.instant(
        CONFIG.xhrResponseHandlerService.defaultMessage
      );
    }
    this.toastService.showToast({
      message,
      duration: 8000
    });
  }
}
