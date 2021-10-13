import { TestBed, waitForAsync } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RouterTestingModule } from '@angular/router/testing';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { of } from 'rxjs';
import { TrackService } from '../../../../../shared/services/track/track.service';

describe('AuthService', () => {
  let service: AuthService;
  let storageSpy: any;
  let jwtHelperServiceSpy: any;
  let crudSpy: any;
  let customHttpServiceSpy: any;
  let trackServiceSpy: any;
  beforeEach(
    waitForAsync(() => {
      crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
      customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', ['post']);
      customHttpServiceSpy.post.and.returnValue(of({}));
      storageSpy = jasmine.createSpyObj('Storage', ['get', 'set', 'remove']);
      jwtHelperServiceSpy = jasmine.createSpyObj('JwtHelperService', ['isTokenExpired']);
      trackServiceSpy = jasmine.createSpyObj('TrackService', ['trackLogin']);
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([])],
        providers: [
          { provide: CrudService, useValue: crudSpy },
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: CustomHttpService, useValue: customHttpServiceSpy },
          { provide: AppStorageService, useValue: storageSpy },
          { provide: JwtHelperService, useValue: jwtHelperServiceSpy },
        ],
      });
    })
  );

  beforeEach(() => {
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call storage when stored token', async () => {
    storageSpy.get.and.returnValue('testJWT');
    const res = await service.storedToken();
    expect(storageSpy.get).toHaveBeenCalledWith('jwt');
    expect(res).toEqual('testJWT');
  });

  it('should be call post on http when refresh token', () => {
    service.refreshToken({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should track login on handle login response', async () => {
    const result = await service.handleLoginResponse({ jwt: 'testJWT', usuario: '' });
    expect(trackServiceSpy.trackLogin).toHaveBeenCalledTimes(1);
    expect(result).toEqual('testJWT');
  });
});
