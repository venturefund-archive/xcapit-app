import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { AppComponent } from './app.component';
import { LanguageService } from './shared/services/language/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TrackService } from './shared/services/track/track.service';
import { UpdateService } from './shared/services/update/update.service';
import { SubmitButtonService } from './shared/services/submit-button/submit-button.service';
import { DefaultPlatformService } from './shared/services/platform/default/default-platform.service';
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
import { WalletMaintenanceService } from './modules/wallets/shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import { DynamicLinkInjectable } from './shared/models/dynamic-link/injectable/dynamic-link-injectable';
import { DynamicLink } from './shared/models/dynamic-link/dynamic-link';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { AppExpirationTimeService } from './shared/models/app-session/injectable/app-expiration-time.service';
import { TxInProgressService } from './modules/swaps/shared-swaps/services/tx-in-progress/tx-in-progress.service';
import { NotificationsService } from './modules/notifications/shared-notifications/services/notifications/notifications.service';
import { BrowserService } from './shared/services/browser/browser.service';
import { CapacitorNotificationsService } from './modules/notifications/shared-notifications/services/capacitor-notifications/capacitor-notifications.service';
import { NetworkInjectable } from './shared/models/network/injectable/network.injectable';
import { FakeNetworkPlugin } from './shared/models/network-plugin/fake/fake-network-plugin';
import { Network } from './shared/models/network/default/network';
import {
  rawWalletConnectUriV1,
  rawWalletConnectUriV2,
} from './modules/wallets/shared-wallets/fixtures/raw-wallet-connect-uri';
import { DefaultWCUri } from './shared/models/wallet-connect/wc-uri/default/default-wc-uri';
import { WCConnectionV2 } from './modules/wallets/shared-wallets/services/wallet-connect/wc-connection-v2/wc-connection-v2';
import { WCService } from './modules/wallets/shared-wallets/services/wallet-connect/wc-service/wc.service';
import { RemoteConfigService } from './shared/services/remote-config/remote-config.service';
import { GoogleAuthService } from './shared/services/google-auth/google-auth.service';
import { FakeListener } from './shared/models/fake-listener/fake-listener';
import { FakeAppStorage } from './shared/services/app-storage/app-storage.service';
import { ActiveLender } from './shared/models/active-lender/active-lender';

describe('AppComponent', () => {
  let platformSpy: jasmine.SpyObj<Platform>;
  let platformServiceSpy: jasmine.SpyObj<DefaultPlatformService>;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;
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
  let fakeStorage: FakeAppStorage;
  let trackedWalletAddressSpy: jasmine.SpyObj<TrackedWalletAddress>;
  let trackedWalletAddressInjectableSpy: jasmine.SpyObj<TrackedWalletAddressInjectable>;
  let capacitorAppInjectableSpy: jasmine.SpyObj<CapacitorAppInjectable>;
  let fakeCapacitorApp: CapacitorApp;
  let appSessionInjectableSpy: jasmine.SpyObj<AppSessionInjectable>;
  let appSessionSpy: jasmine.SpyObj<AppSession>;
  let walletMaintenanceServiceSpy: jasmine.SpyObj<WalletMaintenanceService>;
  let dynamicLinkInjectableSpy: jasmine.SpyObj<DynamicLinkInjectable>;
  let dynamicLinkSpy: jasmine.SpyObj<DynamicLink>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let appExpirationTimeServiceSpy: jasmine.SpyObj<AppExpirationTimeService>;
  let txInProgressServiceSpy: jasmine.SpyObj<TxInProgressService>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;
  let capacitorNotificationsServiceSpy: jasmine.SpyObj<CapacitorNotificationsService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let networkInjectableSpy: jasmine.SpyObj<NetworkInjectable>;
  let walletConnectV2Spy: jasmine.SpyObj<WCConnectionV2>;
  let wcServiceSpy: jasmine.SpyObj<WCService>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  let googleAuthServiceSpy: jasmine.SpyObj<GoogleAuthService>;
  let firebaseDynamicLinksSpy: jasmine.SpyObj<any>;
  let firebaseDynamicLinks: FakeListener | any;

  const aLenderName = 'aLenderName';
  const tapBrowserInApp = {
    actionId: 'tap',
    notification: {
      data: {
        url: 'https://test-url',
      },
    },
  };
  const tapInsideApp = {
    actionId: 'tap',
    notification: {
      data: {
        url: '/test-url',
      },
    },
  };

  beforeEach(waitForAsync(() => {
    googleAuthServiceSpy = jasmine.createSpyObj('googleAuthSpy', { init: Promise.resolve() });
    platformServiceSpy = jasmine.createSpyObj('PlatformSpy', { platform: 'web', isWeb: true, isNative: true });
    submitButtonServiceSpy = jasmine.createSpyObj('SubmitButtonService', ['enabled', 'disabled']);
    trackServiceSpy = jasmine.createSpyObj('FirebaseLogsService', ['trackView', 'startTracker']);
    updateServiceSpy = jasmine.createSpyObj('UpdateService', ['checkForUpdate']);
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
    walletMaintenanceServiceSpy = jasmine.createSpyObj('WalletMaintenanceService', {
      checkTokensStructure: Promise.resolve(),
    });

    browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });

    capacitorNotificationsServiceSpy = jasmine.createSpyObj('NullNotificationsService', [
      'pushNotificationActionPerformed',
    ]);

    notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', {
      getInstance: capacitorNotificationsServiceSpy,
    });

    fakeStorage = new FakeAppStorage({ loggedIn: true });

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
    appExpirationTimeServiceSpy = jasmine.createSpyObj('AppExpirationTimeService', {
      getModalAvailability: true,
    });

    dynamicLinkSpy = jasmine.createSpyObj('DynamicLink', {
      redirect: null,
    });

    dynamicLinkInjectableSpy = jasmine.createSpyObj('DynamicLinkInjectable', {
      create: dynamicLinkSpy,
    });

    fakeModalController = new FakeModalController(null, { role: 'confirm' });
    modalControllerSpy = fakeModalController.createSpy();

    txInProgressServiceSpy = jasmine.createSpyObj('TxInProgressService', {
      checkTransactionStatus: Promise.resolve(),
    });

    networkInjectableSpy = jasmine.createSpyObj('NetworkInjectable', {
      create: new Network(new FakeNetworkPlugin()),
    });

    walletConnectV2Spy = jasmine.createSpyObj('WCConnectionV2', {
      subscribeToAllEvents: Promise.resolve(),
    });

    wcServiceSpy = jasmine.createSpyObj('WCService', {
      set: null,
      uri: new DefaultWCUri(rawWalletConnectUriV1),
    });

    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getFeatureFlag: true,
    });

    firebaseDynamicLinksSpy = jasmine.createSpyObj('FirebaseDynamicLinks', {
      addListener: null,
      removeAllListeners: Promise.resolve(),
    });

    firebaseDynamicLinks = new FakeListener();

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: DefaultPlatformService, useValue: platformServiceSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: UpdateService, useValue: updateServiceSpy },
        { provide: SubmitButtonService, useValue: submitButtonServiceSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: WalletConnectService, useValue: walletConnectServiceSpy },
        { provide: WalletBackupService, useValue: walletBackupServiceSpy },
        { provide: LocalNotificationsService, useValue: localNotificationServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: IonicStorageService, useValue: fakeStorage },
        { provide: TrackedWalletAddressInjectable, useValue: trackedWalletAddressInjectableSpy },
        { provide: CapacitorAppInjectable, useValue: capacitorAppInjectableSpy },
        { provide: AppSessionInjectable, useValue: appSessionInjectableSpy },
        { provide: WalletMaintenanceService, useValue: walletMaintenanceServiceSpy },
        { provide: DynamicLinkInjectable, useValue: dynamicLinkInjectableSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: AppExpirationTimeService, useValue: appExpirationTimeServiceSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
        { provide: TxInProgressService, useValue: txInProgressServiceSpy },
        { provide: NetworkInjectable, useValue: networkInjectableSpy },
        { provide: WCConnectionV2, useValue: walletConnectV2Spy },
        { provide: WCService, useValue: wcServiceSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
        { provide: GoogleAuthService, useValue: googleAuthServiceSpy },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    component.statusBar = statusBarSpy;
    component.firebaseDynamicLinks = firebaseDynamicLinks;
  }));

  it('should create the app', async () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should set up app on init', async () => {
    component.ngOnInit();
    await fixture.whenStable();
    await firebaseDynamicLinks.executeEvent('deepLinkOpen', { url: `https://test-url?lender=${aLenderName}` });
    expect(googleAuthServiceSpy.init).toHaveBeenCalledTimes(1);
    expect(submitButtonServiceSpy.enabled).toHaveBeenCalledTimes(1);
    expect(updateServiceSpy.checkForUpdate).toHaveBeenCalledTimes(1);
    expect(trackServiceSpy.startTracker).toHaveBeenCalledTimes(1);
    expect(platformSpy.ready).toHaveBeenCalledTimes(1);
    expect(languageServiceSpy.setInitialAppLanguage).toHaveBeenCalledTimes(1);
    expect(statusBarSpy.setBackgroundColor).not.toHaveBeenCalled();
    expect(walletBackupServiceSpy.getBackupWarningWallet).toHaveBeenCalledTimes(1);
    expect(localNotificationServiceSpy.init).toHaveBeenCalledTimes(1);
    expect(walletMaintenanceServiceSpy.checkTokensStructure).toHaveBeenCalledTimes(1);
    expect(txInProgressServiceSpy.checkTransactionStatus).toHaveBeenCalledTimes(1);
    expect(component.connected).toBeTrue();
    expect(await (new ActiveLender(fakeStorage)).name()).toEqual(aLenderName);
  });

  it('should navigate to test-url inside the app when tap a notification', async () => {
    capacitorNotificationsServiceSpy.pushNotificationActionPerformed.and.callFake((callback) => {
      callback(tapInsideApp);
    });
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/test-url');
  });

  it('should open browser in app when tap a notification', async () => {
    capacitorNotificationsServiceSpy.pushNotificationActionPerformed.and.callFake((callback) => {
      callback(tapBrowserInApp);
    });
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://test-url' });
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

  it('should validate session when state is active and session is valid', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(appSessionSpy.valid).toHaveBeenCalledTimes(1);
    discardPeriodicTasks();
  }));

  it('should validate session and show login modal when state is active and session is invalid', fakeAsync(() => {
    appSessionSpy.valid.and.returnValue(Promise.resolve(false));
    component.ngOnInit();
    tick();
    expect(appSessionSpy.valid).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    discardPeriodicTasks();
  }));

  it('should check dynamic link redirections when an url is open with app', fakeAsync(() => {
    fakeCapacitorApp = new FakeCapacitorApp();
    spyOn(fakeCapacitorApp, 'onAppUrlOpen').and.callFake((callback) => {
      callback({ url: 'testDynamicLink' });
    });
    capacitorAppInjectableSpy.create.and.returnValue(fakeCapacitorApp);

    component.ngOnInit();
    tick();

    expect(dynamicLinkInjectableSpy.create).toHaveBeenCalledOnceWith('testDynamicLink');
    expect(dynamicLinkSpy.redirect).toHaveBeenCalledTimes(1);
  }));

  it('should initialize wallet connect and check deeplinking when uri is version 1 and user is logged in', fakeAsync(() => {
    fakeCapacitorApp = new FakeCapacitorApp();
    spyOn(fakeCapacitorApp, 'onAppUrlOpen').and.callFake((callback) => {
      callback({ url: rawWalletConnectUriV1 });
    });
    capacitorAppInjectableSpy.create.and.returnValue(fakeCapacitorApp);

    component.ngOnInit();
    tick();

    expect(wcServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(walletConnectServiceSpy.checkDeeplinkUrl).toHaveBeenCalledTimes(1);
  }));

  it('should initialize wallet connect and navigate to new connection when uri is version 2 and user is logged in', fakeAsync(() => {
    fakeCapacitorApp = new FakeCapacitorApp();
    spyOn(fakeCapacitorApp, 'onAppUrlOpen').and.callFake((callback) => {
      callback({ url: rawWalletConnectUriV2 });
    });
    capacitorAppInjectableSpy.create.and.returnValue(fakeCapacitorApp);
    wcServiceSpy.uri.and.returnValue(new DefaultWCUri(rawWalletConnectUriV2));

    component.ngOnInit();
    tick();

    expect(wcServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/wallet-connect/new-connection']);
    expect(walletConnectV2Spy.subscribeToAllEvents).toHaveBeenCalledTimes(1);
  }));

  it('should not subscribe wallet connect v2 events neither navigate to new connection when v2 is disabled', fakeAsync(() => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    fakeCapacitorApp = new FakeCapacitorApp();
    spyOn(fakeCapacitorApp, 'onAppUrlOpen').and.callFake((callback) => {
      callback({ url: rawWalletConnectUriV2 });
    });
    capacitorAppInjectableSpy.create.and.returnValue(fakeCapacitorApp);
    wcServiceSpy.uri.and.returnValue(new DefaultWCUri(rawWalletConnectUriV2));

    component.ngOnInit();
    tick();

    expect(wcServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalledOnceWith(['wallets/wallet-connect/new-connection']);
    expect(walletConnectV2Spy.subscribeToAllEvents).not.toHaveBeenCalled();
  }));

  it('should remove firebase dynamic links listener on destroy', fakeAsync(() => {
    component.ngOnInit();
    tick();
    component.ngOnDestroy();
    tick();
    expect(firebaseDynamicLinks.eventsCount()).toEqual(0);
    discardPeriodicTasks();
  }));
});
