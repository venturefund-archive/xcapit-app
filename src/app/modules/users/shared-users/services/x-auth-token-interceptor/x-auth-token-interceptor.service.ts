import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { XAuthService } from '../x-auth/x-auth.service';
import { EnvService } from '../../../../../shared/services/env/env.service';

@Injectable({
  providedIn: 'root',
})
export class XAuthTokenInterceptorService implements HttpInterceptor {
  constructor(private xAuthService: XAuthService, private env: EnvService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.xAuthService.token()).pipe(
      switchMap((token: string) => {
        return next.handle(request.clone({ headers: this.addToken(request, token) }));
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpHeaders {
    let headers = request.headers;
    if (this.validToken(token) && this.internalUrl(request.url)) {
      headers = headers.set(this.xAuthService.header(), token);
    }
    return headers;
  }

  private internalUrl(url: string): boolean {
    return url.startsWith(this.env.byKey('apiUrl'));
  }

  private validToken(token: string): boolean {
    return !!token;
  }
}
