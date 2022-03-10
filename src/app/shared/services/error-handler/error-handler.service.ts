import { Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private toastService: ToastService, private translate: TranslateService) {}

  handle(response) {
    if (response.error.error_code) {
      const message = this.translate.instant(`errorCodes.${response.error.error_code}`);

      this.toastService.showErrorToast({
        message,
        duration: 8000,
      });
    }
  }
}
