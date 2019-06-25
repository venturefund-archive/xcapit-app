import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { LanguageService } from './shared/services/language/language.service';
import { LoadingService } from './shared/services/loading/loading.service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from './modules/usuarios/shared-usuarios/services/auth/auth.service';
import { ReplaySubject } from 'rxjs';

describe('AppComponent', () => {
  let statusBarSpy: any, splashScreenSpy: any, platformReadySpy: any, platformSpy: any;
  let fixture: ComponentFixture<AppComponent>;
  let languageServiceSpy: any;
  let loadingServiceSpy: any;
  let authServiceMock: any;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['enabled']);
    authServiceMock = { isLoggedIn: new ReplaySubject<boolean>(1) };
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });
    languageServiceSpy = jasmine.createSpyObj('LanguageService', [
      'setInitialAppLanguage'
    ]);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: AuthService, useValue: authServiceMock }
      ],
      imports: [RouterTestingModule.withRoutes([]), TranslateModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
  }));

  it('should create the app', async () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call ngOnInit', async () => {
    const app = fixture.debugElement.componentInstance;
    const spy = spyOn(app, 'ngOnInit');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call routeChangeSubscribe from ngOnInit', async () => {
    const app = fixture.debugElement.componentInstance;
    const spy = spyOn(app, 'routeChangeSubscribe');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('routerEventSubscription should not be null after ngOnInit call', async () => {
    const app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app.routerEventSubscription).not.toBeNull();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });
});
