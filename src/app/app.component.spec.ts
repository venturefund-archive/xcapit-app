import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { NavController, Platform } from '@ionic/angular';
import { AppComponent } from './app.component';
import { LanguageService } from './shared/services/language/language.service';
import { LoadingService } from './shared/services/loading/loading.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from './modules/usuarios/shared-usuarios/services/auth/auth.service';
import { TrackService } from './shared/services/track/track.service';
import { UpdateService } from './shared/services/update/update.service';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';
import { FakeNavController } from '../testing/fakes/nav-controller.fake.spec';
import { PlatformService } from './shared/services/platform/platform.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let platformSpy: jasmine.SpyObj<Platform>;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let updateServiceSpy: jasmine.SpyObj<UpdateService>;
  let submitButtonServiceSpy: jasmine.SpyObj<SubmitButtonService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let statusBarSpy: jasmine.SpyObj<any>;
  let translateSpy: jasmine.SpyObj<TranslateService>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      platformServiceSpy = jasmine.createSpyObj('PlatformSpy', { platform: 'web' });
      submitButtonServiceSpy = jasmine.createSpyObj('SubmitButtonService', ['enabled', 'disabled']);
      trackServiceSpy = jasmine.createSpyObj('FirebaseLogsService', ['trackView', 'startTracker']);
      updateServiceSpy = jasmine.createSpyObj('UpdateService', ['checkForUpdate']);
      loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['enabled']);
      platformSpy = jasmine.createSpyObj('Platform', { ready: Promise.resolve() });
      languageServiceSpy = jasmine.createSpyObj('LanguageService', ['setInitialAppLanguage']);
      authServiceSpy = jasmine.createSpyObj('AuthService', { logout: Promise.resolve() });
      statusBarSpy = jasmine.createSpyObj('StatusBar', { setBackgroundColor: Promise.resolve() });
      translateSpy = jasmine.createSpyObj('TranslateService', {}, { onLangChange: of({}) });
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: Platform, useValue: platformSpy },
          { provide: PlatformService, useValue: platformServiceSpy },
          { provide: LanguageService, useValue: languageServiceSpy },
          { provide: LoadingService, useValue: loadingServiceSpy },
          { provide: AuthService, useValue: authServiceSpy },
          { provide: UpdateService, useValue: updateServiceSpy },
          { provide: SubmitButtonService, useValue: submitButtonServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: TranslateService, useValue: translateSpy },
        ],
        imports: [TranslateModule.forRoot()],
      }).compileComponents();
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      component.statusBar = statusBarSpy;
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
    expect(statusBarSpy.setBackgroundColor).not.toHaveBeenCalled();
  });

  it('should call set background if android platform', async () => {
    platformServiceSpy.platform.and.returnValue('android');
    component.ngOnInit();
    await fixture.whenStable();
    expect(statusBarSpy.setBackgroundColor).toHaveBeenCalledOnceWith({ color: '#1c2d5e' });
  });

  it('should logout', async () => {
    await component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['users/login']);
  });

  it('should set html lang in the correct language on init', async () => {
    const spy = spyOn(component, 'setLanguageSubscribe');
    component.ngOnInit();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
