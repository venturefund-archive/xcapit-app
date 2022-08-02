import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class XhrResponseHandlerService {
  private allow5xxErrors: boolean;

  constructor(private errorHandlerService: ErrorHandlerService) {
    this.allow5xxErrors = !environment.production;
  }

  error(defaultMessage?: string) {
    return (response: HttpErrorResponse) => {
      this.errorHandlerService.handle(response);
      return throwError(response);
    };
  }
}
