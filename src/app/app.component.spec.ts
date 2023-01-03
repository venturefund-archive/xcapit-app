import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { NavController, Platform } from '@ionic/angular';
import { AppComponent } from './app.component';
import { LanguageService } from './shared/services/language/language.service';
import { LoadingService } from './shared/services/loading/loading.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TrackService } from './shared/services/track/track.service';
import { UpdateService } from './shared/services/update/update.service';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';
import { PlatformService } from './shared/services/platform/platform.service';
import { of } from 'rxjs';
import { WalletConnectService } from 'src/app/modules/wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { WalletBackupService } from './modules/wallets/shared-wallets/services/wallet-backup/wallet-backup.service';
import { LocalNotificationsService } from './modules/notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { IonicStorageService } from './shared/services/ionic-storage/ionic-storage.service';
import { TrackedWalletAddress } from './shared/models/tracked-wallet-address/tracked-wallet-address';
import { TrackedWalletAddressInjectable } from './shared/models/tracked-wallet-address/injectable/tracked-wallet-address.injectable';
import { CapacitorAppInjectable } from './shared/models/capacitor-app/injectable/capacitor-app.injectable';
import { FakeCapacitorApp } from './shared/models/capacitor-app/fake/fake-capacitor-app';
import { CapacitorApp } from './shared/models/capacitor-app/capacitor-app.interface';
import { AppSessionInjectable } from './shared/models/app-session/injectable/app-session.injectable';
import { AppSession } from './shared/models/app-session/app-session';

describe('AppComponent', () => {
  let platformSpy: jasmine.SpyObj<Platform>;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let updateServiceSpy: jasmine.SpyObj<UpdateService>;
  let submitButtonServiceSpy: jasmine.SpyObj<SubmitButtonService>;
  let statusBarSpy: jasmine.SpyObj<any>;
  let translateSpy: jasmine.SpyObj<TranslateService>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;
  let walletBackupServiceSpy: jasmine.SpyObj<WalletBackupService>;
  let localNotificationServiceSpy: jasmine.SpyObj<LocalNotificationsService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let trackedWalletAddressSpy: jasmine.SpyObj<TrackedWalletAddress>;
  let trackedWalletAddressInjectableSpy: jasmine.SpyObj<TrackedWalletAddressInjectable>;
  let capacitorAppInjectableSpy: jasmine.SpyObj<CapacitorAppInjectable>;
  let fakeCapacitorApp: CapacitorApp;
  let appSessionInjectableSpy: jasmine.SpyObj<AppSessionInjectable>;
  let appSessionSpy: jasmine.SpyObj<AppSession>;

  beforeEach(waitForAsync(() => {
    platformServiceSpy = jasmine.createSpyObj('PlatformSpy', { platform: 'web', isWeb: true, isNative: true });
    submitButtonServiceSpy = jasmine.createSpyObj('SubmitButtonService', ['enabled', 'disabled']);
    trackServiceSpy = jasmine.createSpyObj('FirebaseLogsService', ['trackView', 'startTracker']);
    updateServiceSpy = jasmine.createSpyObj('UpdateService', ['checkForUpdate']);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['enabled']);
    platformSpy = jasmine.createSpyObj('Platform', { ready: Promise.resolve() });
    languageServiceSpy = jasmine.createSpyObj('LanguageService', ['setInitialAppLanguage']);
    statusBarSpy = jasmine.createSpyObj('StatusBar', { setBackgroundColor: Promise.resolve() });
    translateSpy = jasmine.createSpyObj('TranslateService', {}, { onLangChange: of({}) });
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
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(true),
      set: Promise.resolve(),
    });
    trackedWalletAddressSpy = jasmine.createSpyObj('TrackedWalletAddress', {
      value: null,
      isAlreadyTracked: Promise.resolve(false),
    });
    trackedWalletAddressInjectableSpy = jasmine.createSpyObj('TrackedWalletAddressInjectable', {
      create: trackedWalletAddressSpy,
    });

    fakeCapacitorApp = new FakeCapacitorApp();
    spyOn(fakeCapacitorApp, 'onStateChange').and.callFake((callback) => {
      callback({ isActive: true });
    });
    capacitorAppInjectableSpy = jasmine.createSpyObj('CapacitorAppInjectable', {
      create: fakeCapacitorApp,
    });
    appSessionSpy = jasmine.createSpyObj('AppSession', {
      save: null,
      valid: Promise.resolve(true),
    });
    appSessionInjectableSpy = jasmine.createSpyObj('AppSessionInjectable', {
      create: appSessionSpy,
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
        { provide: UpdateService, useValue: updateServiceSpy },
        { provide: SubmitButtonService, useValue: submitButtonServiceSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: WalletConnectService, useValue: walletConnectServiceSpy },
        { provide: WalletBackupService, useValue: walletBackupServiceSpy },
        { provide: LocalNotificationsService, useValue: localNotificationServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: TrackedWalletAddressInjectable, useValue: trackedWalletAddressInjectableSpy },
        { provide: CapacitorAppInjectable, useValue: capacitorAppInjectableSpy },
        { provide: AppSessionInjectable, useValue: appSessionInjectableSpy },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    component.statusBar = statusBarSpy;
  }));

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

  it('should track wallet address if its not tracked already', async () => {
    component.ngOnInit();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(trackedWalletAddressSpy.value).toHaveBeenCalledTimes(1);
  });

  it('should not track wallet address if its tracked already', async () => {
    trackedWalletAddressSpy.isAlreadyTracked.and.resolveTo(true);
    component.ngOnInit();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(trackedWalletAddressSpy.value).toHaveBeenCalledTimes(0);
  });

  it('should save session when go to background', async () => {
    fakeCapacitorApp = new FakeCapacitorApp();
    spyOn(fakeCapacitorApp, 'onPause').and.callFake((callback) => {
      callback();
    });
    capacitorAppInjectableSpy.create.and.returnValue(fakeCapacitorApp);
    component.ngOnInit();
    await fixture.whenStable();
    expect(appSessionSpy.save).toHaveBeenCalledTimes(1);
  });

  it('should validate session when state is active and session is valid', async () => {
    component.ngOnInit();
    await fixture.whenStable();
    expect(appSessionSpy.valid).toHaveBeenCalledTimes(1);
  });

  it('should validate session when state is active and session is invalid', fakeAsync(() => {
    appSessionSpy.valid.and.returnValue(Promise.resolve(false));
    component.ngOnInit();
    tick();
    expect(appSessionSpy.valid).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['users/login-new']);
    discardPeriodicTasks();
  }));
});
