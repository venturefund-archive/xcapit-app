import { Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XhrResponseHandlerService {
  private msg = 'Error en la comunicación con el servidor';

  constructor(private toastService: ToastService) {}

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
      response.status !== 504 &&
      response.status !== 506
    ) {
      return (
        defaultMessage ||
        (typeof response.error === 'string' && response.error) ||
        (response.error instanceof ArrayBuffer &&
          JSON.parse(
            String.fromCharCode.apply(null, new Uint8Array(response.error))
          )) ||
        response.message ||
        this.msg
      );
    } else {
      return this.msg;
    }
  }
}
