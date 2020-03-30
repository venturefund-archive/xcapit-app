import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { XhrResponseHandlerService } from '../xhr-response-handler/xhr-response-handler.service';
import { LoadingService } from '../loading/loading.service';
import { SubmitButtonService } from '../submit-button/submit-button.service';

@Injectable({
  providedIn: 'root'
})
export class CustomHttpService {
  constructor(
    private http: HttpClient,
    private xhr: XhrResponseHandlerService,
    private loadingService: LoadingService,
    private submitButtonService: SubmitButtonService
  ) {}

  get original(): HttpClient {
    return this.http;
  }

  get(
    url: string,
    options?: any,
    errorMsg?: string,
    loading = true
  ): Observable<any> {
    this.submitButtonService.disabled();
    if (loading) {
      this.loadingService.show();
    }
    return this.http.get(url, options).pipe(
      catchError((response: HttpErrorResponse) =>
        this.xhr.error(errorMsg)(response)
      ),
      finalize(() => {
        this.submitButtonService.enabled();
        this.loadingService.dismiss();
      })
    );
  }

  post(
    url: string,
    data: any,
    errorMsg?: string,
    loading = true
  ): Observable<any> {
    this.submitButtonService.disabled();

    if (loading) {
      this.loadingService.show();
    }
    return this.http.post(url, data).pipe(
      catchError((response: HttpErrorResponse) =>
        this.xhr.error(errorMsg)(response)
      ),
      finalize(() => {
        this.submitButtonService.enabled();
        this.loadingService.dismiss();
      })
    );
  }

  put(
    url: string,
    data: any,
    errorMsg?: string,
    loading = true
  ): Observable<any> {
    this.submitButtonService.disabled();
    if (loading) {
      this.loadingService.show();
    }
    return this.http.put(url, data).pipe(
      catchError((response: HttpErrorResponse) =>
        this.xhr.error(errorMsg)(response)
      ),
      finalize(() => {
        this.submitButtonService.enabled();
        this.loadingService.dismiss();
      })
    );
  }

  delete(url: string, errorMsg?: string, loading = true): Observable<any> {
    this.submitButtonService.disabled();
    if (loading) {
      this.loadingService.show();
    }
    return this.http.delete(url).pipe(
      catchError((response: HttpErrorResponse) =>
        this.xhr.error(errorMsg)(response)
      ),
      finalize(() => {
        this.submitButtonService.enabled();
        this.loadingService.dismiss();
      })
    );
  }
}
