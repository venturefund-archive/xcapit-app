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
import { ReplaySubject } from 'rxjs';
import { TrackService } from './shared/services/track/track.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from './shared/directives/track-click/track-click.directive';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {
  let statusBarSpy: any,
    splashScreenSpy: any,
    platformReadySpy: any,
    platformSpy: any;
  let fixture: ComponentFixture<AppComponent>;
  let languageServiceSpy: any;
  let loadingServiceSpy: any;
  let authServiceMock: any;
  let trackServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<AppComponent>;
  let activatedRouteMock: any;

  beforeEach(async(() => {
    trackServiceSpy = jasmine.createSpyObj('LogsService', ['trackView']);
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['enabled']);
    authServiceMock = {
      isLoggedIn: new ReplaySubject<boolean>(1),
      logout: () => null
    };
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });
    languageServiceSpy = jasmine.createSpyObj('LanguageService', [
      'setInitialAppLanguage'
    ]);
    activatedRouteMock = {};

    TestBed.configureTestingModule({
      declarations: [AppComponent, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'users/login', component: DummyComponent },
          { path: 'tutorials/help', component: DummyComponent },
          { path: 'funds/list', component: DummyComponent },
          { path: 'profiles/user', component: DummyComponent },
          { path: 'funds/deposit-address', component: DummyComponent },
          { path: 'users/password-change', component: DummyComponent }
        ]),
        TranslateModule.forRoot()
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
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
    expect(app.routerNavEndSubscription).not.toBeNull();
  });

  it('should call trackEvent after ngOnInit call', async () => {
    // el TrackService mediante el injector se debería poder obtener de otra
    // manera, pero parece que hay un problema con la abstract class, por ahora
    // queda.
    const localTrackService = fixture.debugElement.injector.get<TrackService>(
      TrackService as Type<TrackService>
    );
    const spy = spyOn(localTrackService, 'trackEvent');
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

  it('should call trackEvent on trackService when elements with the directive are clicked', () => {
    fixture.detectChanges();
    const elms = trackClickDirectiveHelper.getAllElementsWithTheDirective();
    for (const el of elms) {
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    }
    expect(elms.length).toBe(7);
  });
});
