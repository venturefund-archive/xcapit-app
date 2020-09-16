import { CUSTOM_ELEMENTS_SCHEMA, Type } from '@angular/core';
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
import { ReplaySubject, of } from 'rxjs';
import { TrackService } from './shared/services/track/track.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { ActivatedRoute } from '@angular/router';
import { PublicLogsService } from './shared/services/public-logs/public-logs.service';
import { NotificationsService } from './modules/notifications/shared-notifications/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { NotificationsHelperService } from './modules/notifications/shared-notifications/services/notifications-helper/notifications-helper.service';

describe('AppComponent', () => {
  let statusBarSpy: any,
    splashScreenSpy: any,
    platformReadySpy: any,
    platformSpy: any;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let languageServiceSpy: any;
  let loadingServiceSpy: any;
  let authServiceMock: any;
  let trackServiceSpy: any;
  let activatedRouteMock: any;
  let publicLogSpy: any;
  let notificationsServiceSpy: any;
  let pwaNotificationServiceSpy: any;
  let notificationsHelperServiceSpy: any;

  beforeEach(async(() => {
    trackServiceSpy = jasmine.createSpyObj('LogsService', ['trackView']);
    trackServiceSpy.trackView.and.returnValue(null);
    publicLogSpy = {
      trackEvent: () => of(null),
      trackView: () => of(null)
    };
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    statusBarSpy.styleDefault.and.returnValue(null);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    splashScreenSpy.hide.and.returnValue(null);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['enabled']);
    loadingServiceSpy.enabled.and.returnValue(null);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });
    languageServiceSpy = jasmine.createSpyObj('LanguageService', [
      'setInitialAppLanguage'
    ]);
    languageServiceSpy.setInitialAppLanguage.and.returnValue(null);

    authServiceMock = {
      isLoggedIn: new ReplaySubject<boolean>(1),
      logout: () => null
    };
    activatedRouteMock = {};
    pwaNotificationServiceSpy = jasmine.createSpyObj(
      'PwaNotificationsService',
      ['init', 'requestPermission', 'pushNotificationReceived']
    );
    pwaNotificationServiceSpy.requestPermission.and.returnValue(of().toPromise());
    notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', ['getInstance']);
    notificationsServiceSpy.getInstance.and.returnValue(pwaNotificationServiceSpy);
    notificationsHelperServiceSpy = jasmine.createSpyObj('NotificationsHelperService', ['save']);

    TestBed.configureTestingModule({
      declarations: [AppComponent, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PublicLogsService, useValue: publicLogSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
        { provide: NotificationsHelperService, useValue: notificationsHelperServiceSpy }
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'users/login', component: DummyComponent },
          { path: 'tutorials/help', component: DummyComponent },
          { path: 'tabs/funds', component: DummyComponent },
          { path: 'profiles/user', component: DummyComponent },
          { path: 'deposits/currency', component: DummyComponent },
          { path: 'users/password-change', component: DummyComponent },
          { path: 'referrals/list', component: DummyComponent },
          { path: 'notifications/list', component: DummyComponent }
        ]),
        TranslateModule.forRoot()
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    publicLogSpy = TestBed.inject(PublicLogsService);
  }));

  it('should create the app', async () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  xit('should call ngOnInit', async () => {
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
    expect(app.routerNavEndSubscription).not.toBeNull();
  });

  it('should call trackEvent  after ngOnInit call', async () => {
    // el TrackService mediante el injector se debería poder obtener de otra
    // manera, pero parece que hay un problema con la abstract class, por ahora
    // queda.
    const isUnauthRoute = spyOn(component, 'isUnauthRoute');
    isUnauthRoute.and.returnValue(0);
    const localTrackService = fixture.debugElement.injector.get<TrackService>(
      TrackService as Type<TrackService>
    );
    const spy = spyOn(localTrackService, 'trackEvent');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent after ngOnInit call unauth', async () => {
    const isUnauthRoute = spyOn(component, 'isUnauthRoute');
    isUnauthRoute.and.returnValue(1);
    const spy = spyOn(publicLogSpy, 'trackEvent').and.returnValue(of(null));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  it('should get instance of notification service on ngAfterViewInit', () => {
    fixture.detectChanges();
    expect(notificationsServiceSpy.getInstance).toHaveBeenCalledTimes(1);
  });

  it('should init notification service on ngAfterViewInit', async (done) => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(pwaNotificationServiceSpy.init).toHaveBeenCalledTimes(1);
      expect(pwaNotificationServiceSpy.requestPermission).toHaveBeenCalledTimes(1);
      expect(pwaNotificationServiceSpy.pushNotificationReceived).toHaveBeenCalledTimes(1);
    });
    done();
  });
});
