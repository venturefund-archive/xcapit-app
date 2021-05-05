import {RefreshTokenInterceptorService} from './refresh-token-interceptor.service';
import {AuthService} from '../auth/auth.service';
import {of, throwError} from 'rxjs';
import {HttpErrorResponse, HttpRequest} from '@angular/common/http';


describe('RefreshTokenInterceptorService', () => {

    it('should be created', () => {
        expect(new RefreshTokenInterceptorService({} as AuthService)).toBeTruthy();
    });

    describe('intercept', () => {

        const httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['clone']);
        const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
        httpRequestSpy.headers = {set: () => ''};
        httpRequestSpy.clone = () => httpRequestSpy;

        it('should catch first error and resend the request', async () => {
            const fakeAuthService = {
                checkRefreshToken: () => Promise.resolve(true),
                storedToken: () => Promise.resolve('asdf')
            };
            const service = new RefreshTokenInterceptorService(fakeAuthService as AuthService);
            httpHandlerSpy.handle.and.returnValues(throwError(new HttpErrorResponse({status: 401})), of(true));

            const req = await service.intercept(httpRequestSpy, httpHandlerSpy).toPromise();

            expect(req).toBeTruthy();
        });

        it('should catch first error and raise the second one', async () => {
            const fakeAuthService = {checkRefreshToken: () => Promise.resolve(false)};
            const service = new RefreshTokenInterceptorService(fakeAuthService as AuthService);
            httpHandlerSpy.handle.and.returnValue(throwError(new HttpErrorResponse({status: 401})));

            await expectAsync(service.intercept(httpRequestSpy, httpHandlerSpy).toPromise()).toBeRejected();
        });

        it('should catch first error and re raise', async () => {
            const service = new RefreshTokenInterceptorService({} as AuthService);
            httpHandlerSpy.handle.and.returnValue(throwError(new HttpErrorResponse({status: 400})));

            await expectAsync(service.intercept(httpRequestSpy, httpHandlerSpy).toPromise()).toBeRejected();
        });

        it('should add authorization header', async () => {
            const testToken = 'testToken';
            const service = new RefreshTokenInterceptorService({} as AuthService);

            const result = service.modifiedRequest(new HttpRequest('GET', '/'), testToken);

            expect(result.headers.get('authorization')).toEqual(`Bearer ${testToken}`);
        });
    });
});
