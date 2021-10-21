import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { XhrResponseHandlerService } from '../xhr-response-handler/xhr-response-handler.service';
import { LoadingService } from '../loading/loading.service';
import { SubmitButtonService } from '../submit-button/submit-button.service';

@Injectable({
  providedIn: 'root',
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

  private doGet(url: string, options?: any, errorMsg?: string, loading?: boolean): Observable<any> {
    this.submitButtonService.disabled();
    return this.http.get(url, options).pipe(
      catchError((response: HttpErrorResponse) => this.xhr.error(errorMsg)(response)),
      finalize(() => {
        this.submitButtonService.enabled();
        if (loading) this.loadingService.dismiss();
      })
    );
  }

  get(url: string, options?: any, errorMsg?: string, loading = true): Observable<any> {
    return loading
      ? from(this.loadingService.show().then(() => this.doGet(url, options, errorMsg, loading).toPromise()))
      : this.doGet(url, options, errorMsg, loading);
  }

  private doPost(url: string, data: any, errorMsg?: string, loading?: boolean): Observable<any> {
    this.submitButtonService.disabled();
    return this.http.post(url, data).pipe(
      catchError((response: HttpErrorResponse) => this.xhr.error(errorMsg)(response)),
      finalize(() => {
        this.submitButtonService.enabled();
        if (loading) this.loadingService.dismiss();
      })
    );
  }

  post(url: string, data: any, errorMsg?: string, loading = true): Observable<any> {
    return loading
      ? from(this.loadingService.show().then(() => this.doPost(url, data, errorMsg, loading).toPromise()))
      : this.doPost(url, data, errorMsg, loading);
  }

  private doPut(url: string, data: any, errorMsg?: string, loading?: boolean): Observable<any> {
    this.submitButtonService.disabled();
    return this.http.put(url, data).pipe(
      catchError((response: HttpErrorResponse) => this.xhr.error(errorMsg)(response)),
      finalize(() => {
        this.submitButtonService.enabled();
        if (loading) this.loadingService.dismiss();
      })
    );
  }

  put(url: string, data: any, errorMsg?: string, loading = true): Observable<any> {
    return loading
      ? from(this.loadingService.show().then(() => this.doPut(url, data, errorMsg, loading).toPromise()))
      : this.doPut(url, data, errorMsg, loading);
  }

  private doDelete(url: string, errorMsg?: string, loading?: boolean): Observable<any> {
    this.submitButtonService.disabled();
    return this.http.delete(url).pipe(
      catchError((response: HttpErrorResponse) => this.xhr.error(errorMsg)(response)),
      finalize(() => {
        this.submitButtonService.enabled();
        if (loading) this.loadingService.dismiss();
      })
    );
  }

  delete(url: string, errorMsg?: string, loading = true): Observable<any> {
    return loading
      ? from(this.loadingService.show().then(() => this.doDelete(url, errorMsg, loading).toPromise()))
      : this.doDelete(url, errorMsg, loading);
  }
}
