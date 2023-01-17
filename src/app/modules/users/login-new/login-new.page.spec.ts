import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { LoginNewPage } from './login-new.page';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeBiometricAuth } from 'src/app/shared/models/biometric-auth/fake/fake-biometric-auth';
import { BiometricAuthInjectable } from 'src/app/shared/models/biometric-auth/injectable/biometric-auth-injectable';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { NullNotificationsService } from '../../notifications/shared-notifications/services/null-notifications/null-notifications.service';
import { WalletBackupService } from '../../wallets/shared-wallets/services/wallet-backup/wallet-backup.service';
import { LoginBiometricActivationModalService } from '../shared-users/services/login-biometric-activation-modal-service/login-biometric-activation-modal.service';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { BiometricAuth } from 'src/app/shared/models/biometric-auth/biometric-auth.interface';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { LoginMigrationService } from '../shared-users/services/login-migration-service/login-migration-service';
import { PasswordErrorMsgs } from '../../swaps/shared-swaps/models/password/password-error-msgs';
import { AuthService } from '../shared-users/services/auth/auth.service';
import { WalletConnectService } from '../../wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { BehaviorSubject } from 'rxjs';

describe('LoginNewPage', () => {
  const aPassword = 'aPassword';
  const aHashedPassword = 'iRJ1cT5x4V2jlpnVB0gp3bXdN4Uts3EAz4njSxGUNNqOGdxdWpjiTTWLOIAUp+6ketRUhjoRZBS8bpW5QnTnRA==';
  let component: LoginNewPage;
  let fixture: ComponentFixture<LoginNewPage>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<LoginNewPage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let biometricAuthInjectableSpy: jasmine.SpyObj<BiometricAuthInjectable>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;
  let nullNotificationServiceSpy: jasmine.SpyObj<NullNotificationsService>;
  let walletBackupServiceSpy: jasmine.SpyObj<WalletBackupService>;
  let loginBiometricActivationModalSpy: jasmine.SpyObj<LoginBiometricActivationModalService>;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;
  let fakeBiometricAuth: BiometricAuth;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  let loginMigrationServiceSpy: jasmine.SpyObj<LoginMigrationService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;

  beforeEach(waitForAsync(() => {
    fakeBiometricAuth = new FakeBiometricAuth();
    authServiceSpy = jasmine.createSpyObj('AuthService', { logout: Promise.resolve() });
    biometricAuthInjectableSpy = jasmine.createSpyObj('BiometricAuthInjectable', {
      create: fakeBiometricAuth,
    });
    nullNotificationServiceSpy = jasmine.createSpyObj('NullNotificationsService', [
      'init',
      'subscribeTo',
      'unsubscribeFrom',
    ]);
    notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', {
      getInstance: nullNotificationServiceSpy,
    });
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showErrorToast: Promise.resolve(),
      showInfoToast: Promise.resolve(),
      dismiss: Promise.resolve(),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(),
      set: Promise.resolve(),
    });
    ionicStorageServiceSpy.get.withArgs('loginToken').and.resolveTo(aHashedPassword);
    ionicStorageServiceSpy.get.withArgs('enabledPushNotifications').and.resolveTo(true);
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    loginBiometricActivationModalSpy = jasmine.createSpyObj('LoginBiometricActivationModalService', {
      isShowModal: Promise.resolve(true),
    });
    platformServiceSpy = jasmine.createSpyObj('PlatformService', {
      isNative: true,
    });

    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getFeatureFlag: true,
    });

    walletBackupServiceSpy = jasmine.createSpyObj('WalletBackupService', { enableModal: Promise.resolve() });

    loginMigrationServiceSpy = jasmine.createSpyObj('LoginMigrationService', { migrate: Promise.resolve() });

    nullNotificationServiceSpy = jasmine.createSpyObj('NullNotificationsService', [
      'init',
      'subscribeTo',
      'unsubscribeFrom',
    ]);

    notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', {
      getInstance: nullNotificationServiceSpy,
    });

    walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', {
      uri: new BehaviorSubject(null),
      checkDeeplinkUrl: Promise.resolve(null),
    });

    TestBed.configureTestingModule({
      declarations: [LoginNewPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: BiometricAuthInjectable, useValue: biometricAuthInjectableSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
        { provide: WalletBackupService, useValue: walletBackupServiceSpy },
        { provide: LoginBiometricActivationModalService, useValue: loginBiometricActivationModalSpy },
        { provide: PlatformService, useValue: platformServiceSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
        { provide: LoginMigrationService, useValue: loginMigrationServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: WalletConnectService, useValue: walletConnectServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login with biometric auth when is enabled', fakeAsync(() => {
    biometricAuthInjectableSpy.create.and.returnValue(
      new FakeBiometricAuth(
        Promise.resolve(true),
        Promise.resolve(true),
        Promise.resolve({ verified: true }),
        null,
        Promise.resolve(aPassword)
      )
    );

    component.ionViewWillEnter();
    tick();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tabs/wallets', { replaceUrl: true });
  }));

  it('should enable push notifications by default', fakeAsync(() => {
    ionicStorageServiceSpy.get.withArgs('enabledPushNotifications').and.resolveTo(null);
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledOnceWith('enabledPushNotifications', true);
  }));

  it('should init push notifications and subscribe to topic when password is ok and push notifications previously activated', fakeAsync(() => {
    component.ionViewWillEnter();
    component.form.patchValue({ password: aPassword });
    component.handleSubmit(false);
    fixture.detectChanges();
    tick();
    expect(notificationsServiceSpy.getInstance).toHaveBeenCalledTimes(2);
    expect(nullNotificationServiceSpy.init).toHaveBeenCalledTimes(1);
    expect(nullNotificationServiceSpy.subscribeTo).toHaveBeenCalledTimes(1);
  }));

  it('should init push notifications and unsubscribe to topic when password is ok and push notifications previously disabled', fakeAsync(() => {
    component.ionViewWillEnter();
    ionicStorageServiceSpy.get.withArgs('enabledPushNotifications').and.resolveTo(false);
    component.form.patchValue({ password: aPassword });
    component.handleSubmit(false);
    fixture.detectChanges();
    tick();
    expect(notificationsServiceSpy.getInstance).toHaveBeenCalledTimes(3);
    expect(nullNotificationServiceSpy.init).toHaveBeenCalledTimes(1);
    expect(nullNotificationServiceSpy.subscribeTo).toHaveBeenCalledTimes(1);
    expect(nullNotificationServiceSpy.unsubscribeFrom).toHaveBeenCalledTimes(1);
  }));

  it('should login when password is ok', async () => {
    component.ionViewWillEnter();
    component.form.patchValue({ password: aPassword });

    await component.handleSubmit(false);

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tabs/wallets', { replaceUrl: true });
  });

  it('should show error toast when password is not ok', async () => {
    component.form.patchValue({ password: 'anInvalidPassword' });

    await component.handleSubmit(false);

    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
      message: 'users.login_new.invalid_password_text',
      duration: 8000,
    });
  });

  it('should dismiss modal when input is clicked', () => {
    fixture.debugElement.query(By.css('app-ux-input[controlName="password"]')).nativeElement.click();
    expect(toastServiceSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should access to faqs when help button is clicked', async () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_login_help');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/support/options');
  });

  it('should call trackEvent on trackService when forget_password clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_recover_password');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/users/recovery-info');
  });

  it('should show informative password modal when info button is clicked', async () => {
    fixture.debugElement.query(By.css('app-ux-input')).triggerEventHandler('infoIconClicked', undefined);
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should track screenview event on init', async () => {
    await component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should enable modal when no protected wallet', async () => {
    await component.ionViewWillEnter();
    ionicStorageServiceSpy.get.withArgs('protectedWallet').and.returnValue(Promise.resolve(false));
    component.form.patchValue({ password: aPassword });

    await component.handleSubmit(false);
    expect(walletBackupServiceSpy.enableModal).toHaveBeenCalledTimes(1);
  });

  it('show info toast when biometric auth is incorrect three times', fakeAsync(() => {
    biometricAuthInjectableSpy.create.and.returnValue(
      new FakeBiometricAuth(
        null,
        Promise.resolve(true),
        Promise.resolve({ verified: false, message: 'Authentication failed.' }),
        null,
        null
      )
    );
    component.ionViewWillEnter();
    tick();
    expect(toastServiceSpy.showInfoToast).toHaveBeenCalledTimes(1);
  }));

  it('should show biometric activation modal when available and not enabled', async () => {
    biometricAuthInjectableSpy.create.and.returnValue(
      new FakeBiometricAuth(Promise.resolve(true), Promise.resolve(false), null, null, null)
    );
    await component.ionViewWillEnter();
    component.form.patchValue({ password: aPassword });

    await component.handleSubmit(false);

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should activate biometric auth on modal confirm', fakeAsync(() => {
    fakeModalController.modifyReturns({ data: 'confirm' }, null);
    biometricAuthInjectableSpy.create.and.returnValue(
      new FakeBiometricAuth(Promise.resolve(true), Promise.resolve(false), null, null, null)
    );
    component.ionViewWillEnter();
    tick();
    const spy = spyOn(component.biometricAuth, 'on').and.callThrough();
    component.form.patchValue({ password: aPassword });

    component.handleSubmit(false);
    tick();

    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should not call handle submit on  bio auth is disabled', fakeAsync(() => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    biometricAuthInjectableSpy.create.and.returnValue(
      new FakeBiometricAuth(null, Promise.resolve(true), Promise.resolve({ verified: true, message: '' }), null, null)
    );
    const handleSubmitSpy = spyOn(component, 'handleSubmit');

    component.ionViewWillEnter();
    tick();

    expect(handleSubmitSpy).toHaveBeenCalledTimes(0);
  }));

  it('should migrate when login token does not exist', async () => {
    ionicStorageServiceSpy.get.withArgs('loginToken').and.returnValue(null);
    await component.ionViewWillEnter();
    component.form.patchValue({ password: aPassword });

    await component.handleSubmit(false);

    expect(loginMigrationServiceSpy.migrate).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tabs/wallets', { replaceUrl: true });
  });

  it('should migrate when login token does not exist', async () => {
    loginMigrationServiceSpy.migrate.and.rejectWith({ message: new PasswordErrorMsgs().invalid() });
    ionicStorageServiceSpy.get.withArgs('loginToken').and.returnValue(null);
    await component.ionViewWillEnter();

    await component.handleSubmit(false);

    expect(loginMigrationServiceSpy.migrate).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
      message: 'users.login_new.invalid_password_text',
      duration: 8000,
    });
  });

  it('should remove old jwt tokens on init', async () => {
    await component.ionViewWillEnter();
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
  });

  it('should call walletConnectService checkDeeplinkUrl on Success when has a uri defined', fakeAsync(() => {
    walletConnectServiceSpy.uri = new BehaviorSubject('wc:///');
    component.ionViewWillEnter();
    component.form.patchValue({ password: aPassword });
    fixture.detectChanges();

    component.handleSubmit(false);
    tick();

    expect(walletConnectServiceSpy.checkDeeplinkUrl).toHaveBeenCalled();
  }));
});
