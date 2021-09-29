import { CUSTOM_ELEMENTS_SCHEMA, Type } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { LanguageService } from './shared/services/language/language.service';
import { LoadingService } from './shared/services/loading/loading.service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from './modules/usuarios/shared-usuarios/services/auth/auth.service';
import { TrackService } from './shared/services/track/track.service';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { UpdateService } from './shared/services/update/update.service';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';
import { FakeNavController } from '../testing/fakes/nav-controller.fake.spec';

describe('AppComponent', () => {
  let statusBarSpy: any;
  let splashScreenSpy: any;
  let platformSpy: any;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let languageServiceSpy: any;
  let loadingServiceSpy: any;
  let authServiceSpy: any;
  let trackServiceSpy: any;
  let updateServiceSpy: any;
  let submitButtonServiceSpy: any;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      submitButtonServiceSpy = jasmine.createSpyObj('SubmitButtonService', ['enabled', 'disabled']);
      trackServiceSpy = jasmine.createSpyObj('FirebaseLogsService', ['trackView', 'startTracker']);
      updateServiceSpy = jasmine.createSpyObj('UpdateService', ['checkForUpdate']);
      statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
      splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
      loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['enabled']);
      platformSpy = jasmine.createSpyObj('Platform', { ready: Promise.resolve() });
      languageServiceSpy = jasmine.createSpyObj('LanguageService', ['setInitialAppLanguage']);
      authServiceSpy = jasmine.createSpyObj('AuthService', { logout: Promise.resolve() });

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
          { provide: AuthService, useValue: authServiceSpy },
          { provide: UpdateService, useValue: updateServiceSpy },
          { provide: SubmitButtonService, useValue: submitButtonServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
        imports: [TranslateModule.forRoot()],
      }).compileComponents();
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    })
  );

  it('should create the app', async () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should set up app on init', async () => {
    component.ngOnInit();
    await fixture.whenStable();
    expect(submitButtonServiceSpy.enabled).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.enabled).toHaveBeenCalledTimes(1);
    expect(updateServiceSpy.checkForUpdate).toHaveBeenCalledTimes(1);
    expect(trackServiceSpy.startTracker).toHaveBeenCalledTimes(1);
    expect(platformSpy.ready).toHaveBeenCalledTimes(1);
    expect(languageServiceSpy.setInitialAppLanguage).toHaveBeenCalledTimes(1);
    expect(statusBarSpy.styleDefault).toHaveBeenCalledTimes(1);
    expect(splashScreenSpy.hide).toHaveBeenCalledTimes(1);
  });

  it('should logout', async () => {
    await component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['users/login']);
  });
});
