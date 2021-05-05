import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {fromPromise} from 'rxjs/internal-compatibility';
import {catchError, mergeMap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RefreshTokenInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((httpErrorResponse: HttpErrorResponse) => {
                return (httpErrorResponse.status === 401)
                    ? fromPromise(this.authService.checkRefreshToken()).pipe(
                        mergeMap(refreshIsOk => {
                            return refreshIsOk
                                ? fromPromise(this.authService.storedToken()).pipe(
                                    mergeMap(token => next.handle(this.modifiedRequest(req, token))
                                    ))
                                : throwError(httpErrorResponse);
                        })
                    )
                    : throwError(httpErrorResponse);
            })
        );
    }

    modifiedRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({headers: req.headers.set('authorization', `Bearer ${token}`)});
    }
}
