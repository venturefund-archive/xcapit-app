import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { NavController, Platform } from '@ionic/angular';
import { AppComponent } from './app.component';
import { LanguageService } from './shared/services/language/language.service';
import { LoadingService } from './shared/services/loading/loading.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from './modules/users/shared-users/services/auth/auth.service';
import { TrackService } from './shared/services/track/track.service';
import { UpdateService } from './shared/services/update/update.service';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';
import { PlatformService } from './shared/services/platform/platform.service';
import { of } from 'rxjs';
import { UpdateNewsService } from './shared/services/update-news/update-news.service';
import { RemoteConfigService } from './shared/services/remote-config/remote-config.service';
import { FirebaseService } from './shared/services/firebase/firebase.service';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { WalletBackupService } from './modules/wallets/shared-wallets/services/wallet-backup/wallet-backup.service';
import { LocalNotificationsService } from './modules/notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

fdescribe('AppComponent', () => {
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
  let statusBarSpy: jasmine.SpyObj<any>;
  let translateSpy: jasmine.SpyObj<TranslateService>;
  let updateNewsServiceSpy: jasmine.SpyObj<UpdateNewsService>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  let firebaseServiceSpy: jasmine.SpyObj<FirebaseService>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;
  let walletBackupServiceSpy: jasmine.SpyObj<WalletBackupService>;
  let localNotificationServiceSpy: jasmine.SpyObj<LocalNotificationsService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;


  beforeEach(
    waitForAsync(() => {
      platformServiceSpy = jasmine.createSpyObj('PlatformSpy', { platform: 'web', isWeb: true, isNative: true });
      submitButtonServiceSpy = jasmine.createSpyObj('SubmitButtonService', ['enabled', 'disabled']);
      trackServiceSpy = jasmine.createSpyObj('FirebaseLogsService', ['trackView', 'startTracker']);
      updateServiceSpy = jasmine.createSpyObj('UpdateService', ['checkForUpdate']);
      loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['enabled']);
      platformSpy = jasmine.createSpyObj('Platform', { ready: Promise.resolve() });
      languageServiceSpy = jasmine.createSpyObj('LanguageService', ['setInitialAppLanguage']);
      authServiceSpy = jasmine.createSpyObj('AuthService', { logout: Promise.resolve() });
      statusBarSpy = jasmine.createSpyObj('StatusBar', { setBackgroundColor: Promise.resolve() });
      translateSpy = jasmine.createSpyObj('TranslateService', {}, { onLangChange: of({}) });
      updateNewsServiceSpy = jasmine.createSpyObj('UpdateNewsService', { showModal: Promise.resolve() });
      remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', { initialize: Promise.resolve() });
      firebaseServiceSpy = jasmine.createSpyObj('FirebaseService', { init: null, getApp: {} });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      localNotificationServiceSpy = jasmine.createSpyObj('LocalNotificationsService', ['init']);
      walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', {
        retrieveWalletConnect: Promise.resolve(null),
        setUri: null,
        checkDeeplinkUrl: null,
        checkConnection: Promise.resolve(),
      });

      walletBackupServiceSpy = jasmine.createSpyObj('WalletBackupService', {
        getBackupWarningWallet: Promise.resolve(),
      });

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
          { provide: TranslateService, useValue: translateSpy },
          { provide: UpdateNewsService, useValue: updateNewsServiceSpy },
          { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
          { provide: FirebaseService, useValue: firebaseServiceSpy },
          { provide: WalletConnectService, useValue: walletConnectServiceSpy },
          { provide: WalletBackupService, useValue: walletBackupServiceSpy },
          { provide: LocalNotificationsService, useValue: localNotificationServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
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
    expect(remoteConfigServiceSpy.initialize).toHaveBeenCalledTimes(1);
    expect(firebaseServiceSpy.init).toHaveBeenCalledTimes(1);
    expect(statusBarSpy.setBackgroundColor).not.toHaveBeenCalled();
    expect(walletBackupServiceSpy.getBackupWarningWallet).toHaveBeenCalledTimes(1);
    expect(localNotificationServiceSpy.init).toHaveBeenCalledTimes(1);
  });

  it('should call set background if android platform', async () => {
    platformServiceSpy.platform.and.returnValue('android');
    component.ngOnInit();
    await fixture.whenStable();
    expect(statusBarSpy.setBackgroundColor).toHaveBeenCalledOnceWith({ color: '#1c2d5e' });
  });

  it('should set html lang in the correct language on init', async () => {
    const spy = spyOn(component, 'setLanguageSubscribe');
    component.ngOnInit();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
