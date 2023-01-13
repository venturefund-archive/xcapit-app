import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController, ModalController } from '@ionic/angular';
import { of, ReplaySubject } from 'rxjs';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { AuthService } from 'src/app/modules/users/shared-users/services/auth/auth.service';
import { UserProfileMenuPage } from './user-profile-menu.page';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { LanguageService } from '../../../shared/services/language/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { MenuCategory } from '../shared-profiles/interfaces/menu-category.interface';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { LogOutModalService } from '../shared-profiles/services/log-out-modal/log-out-modal.service';
import { ApiTicketsService } from '../../tickets/shared-tickets/services/api-tickets.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { IonicStorageService } from '../../../shared/services/ionic-storage/ionic-storage.service';
import { WalletConnectService } from '../../wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { Storage } from '@ionic/storage';
import { WalletBackupService } from '../../wallets/shared-wallets/services/wallet-backup/wallet-backup.service';
import { BiometricAuthInjectable } from '../../../shared/models/biometric-auth/injectable/biometric-auth-injectable';
import { RemoteConfigService } from '../../../shared/services/remote-config/remote-config.service';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { NullNotificationsService } from '../../notifications/shared-notifications/services/null-notifications/null-notifications.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AppVersionInjectable } from 'src/app/shared/models/app-version/injectable/app-version.injectable';
import { FakeAppVersion } from 'src/app/shared/models/app-version/fake/fake-app-version';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { AppUpdateAvailability } from '@capawesome/capacitor-app-update';
import { UpdateAppService } from 'src/app/shared/services/update-app/update-app.service';

describe('UserProfileMenuPage', () => {
  const itemMenu: MenuCategory[] = [
    {
      category_title: 'profiles.user_profile_menu.category_help',
      icon: 'assets/ux-icons/ux-support.svg',
      showCategory: true,
      items: [
        {
          name: 'Faq',
          text: 'profiles.user_profile_menu.faq_help',
          route: '/support/options',
          type: 'link',
        },
        {
          name: 'Support',
          text: 'profiles.user_profile_menu.support_help',
          route: '/tickets/new-create-support-ticket',
          type: 'link',
          buttonName: 'ux_go_to_contact_support',
        },
      ],
    },
    {
      category_title: 'profiles.user_profile_menu.category_security_account',
      icon: 'assets/ux-icons/ux-lock-outline.svg',
      showCategory: true,
      items: [
        {
          name: 'PasswordChangeAccount',
          text: 'profiles.user_profile_menu.change_pass',
          route: '/users/password-change',
          type: 'link',
        },
      ],
    },
    {
      category_title: 'profiles.user_profile_menu.category_security_wallet',
      icon: 'assets/ux-icons/ux-key-outline.svg',
      showCategory: true,
      items: [
        {
          name: 'RecoveryPhrase',
          text: 'profiles.user_profile_menu.security_phrase',
          route: '/wallets/recovery/info',
          type: 'link',
        },
      ],
    },
    {
      id: 'wallet',
      showCategory: false,
      category_title: '',
      icon: '',
      items: [
        {
          name: 'BiometricAuth',
          hidden: true,
          text: 'profiles.user_profile_menu.security_phrase',
          route: '/wallets/recovery/info',
          type: 'link',
        },
      ],
    },
    {
      id: 'contacts',
      showCategory: true,
      category_title: '',
      icon: '',
      items: [],
    },
  ];

  const profile = { email: 'test@mail.com' };

  const anERC20Address = '0x0123456789101112131415';
  let component: UserProfileMenuPage;
  let fixture: ComponentFixture<UserProfileMenuPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UserProfileMenuPage>;
  let apiProfilesServiceSpy: jasmine.SpyObj<ApiProfilesService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let logOutModalServiceSpy: jasmine.SpyObj<LogOutModalService>;
  let apiTicketsServiceSpy: jasmine.SpyObj<ApiTicketsService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;
  let storageSpy: jasmine.SpyObj<Storage>;
  let walletBackupServiceSpy: jasmine.SpyObj<WalletBackupService>;
  let biometricAuthInjectableSpy: jasmine.SpyObj<BiometricAuthInjectable>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;
  let nullNotificationServiceSpy: jasmine.SpyObj<NullNotificationsService>;
  let fakeAppVersion: FakeAppVersion;
  let appVersionInjectableSpy: jasmine.SpyObj<AppVersionInjectable>;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;
  let appUpdateSpy: jasmine.SpyObj<any>;
  let updateAppServiceSpy: jasmine.SpyObj<UpdateAppService>;

  beforeEach(waitForAsync(() => {
    logOutModalServiceSpy = jasmine.createSpyObj('LogOutModalService', {
      isShowModalTo: Promise.resolve(true),
      addUserToNotShowModal: Promise.resolve(),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    apiProfilesServiceSpy = jasmine.createSpyObj('ApiProfilesService', { getUserData: of(profile) });
    authServiceSpy = jasmine.createSpyObj(
      'AuthService',
      {
        logout: null,
      },
      {
        isLoggedIn: new ReplaySubject<boolean>(1),
      }
    );

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

    languageServiceSpy = jasmine.createSpyObj('LanguageService', {
      setInitialAppLanguage: null,
      getLanguages: [],
      setLanguage: null,
      getSelectedLanguage: Promise.resolve('es'),
    });

    fakeWalletService = new FakeWalletService(true, {}, { ERC20: anERC20Address });
    walletServiceSpy = fakeWalletService.createSpy();

    apiTicketsServiceSpy = jasmine.createSpyObj(
      'ApiTicketsService',
      {},
      {
        crud: jasmine.createSpyObj('CRUD', {
          create: of(),
        }),
      }
    );

    walletBackupServiceSpy = jasmine.createSpyObj('WalletBackupService', {
      enableModal: Promise.resolve(),
    });

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      removeWalletFromStorage: Promise.resolve(),
    });
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(false),
      set: Promise.resolve(),
    });

    walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', {
      killSession: Promise.resolve(),
    });

    storageSpy = jasmine.createSpyObj('Storage', {
      set: Promise.resolve(),
    });

    biometricAuthInjectableSpy = jasmine.createSpyObj('BiometricAuthInjectable', {
      create: { available: () => Promise.resolve(true) },
    });

    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getFeatureFlag: false,
    });

    fakeAppVersion = new FakeAppVersion(Promise.resolve('3.0.1'));

    appVersionInjectableSpy = jasmine.createSpyObj('AppVersionInjectable', {
      create: fakeAppVersion,
    });

    platformServiceSpy = jasmine.createSpyObj('PlatformService', {
      isNative: true,
      platform: 'android',
    });

    appUpdateSpy = jasmine.createSpyObj('AppUpdate', {
      getAppUpdateInfo: Promise.resolve({
        updateAvailability: AppUpdateAvailability.UPDATE_AVAILABLE,
      }),
    });

    updateAppServiceSpy = jasmine.createSpyObj('UpdateAppService', {
      update: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [UserProfileMenuPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: ApiProfilesService, useValue: apiProfilesServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: LogOutModalService, useValue: logOutModalServiceSpy },
        { provide: ApiTicketsService, useValue: apiTicketsServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: WalletConnectService, useValue: walletConnectServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: WalletBackupService, useValue: walletBackupServiceSpy },
        { provide: BiometricAuthInjectable, useValue: biometricAuthInjectableSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
        { provide: AppVersionInjectable, useValue: appVersionInjectableSpy },
        { provide: PlatformService, useValue: platformServiceSpy },
        { provide: UpdateAppService, useValue: updateAppServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileMenuPage);
    component = fixture.componentInstance;
    component.appUpdate = appUpdateSpy;
    component.itemMenu = itemMenu;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set toggle on enter', async () => {
    await component.ionViewWillEnter();
    expect(component.form.value.notifications).toBeFalse();
  });

  it('should render properly push notifications toggle', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();
    const toggle = fixture.debugElement.query(By.css('ion-toggle[name="ux_push_notifications"]'));
    expect(toggle).toBeTruthy();
  });

  it('should subscribe to push notifications', async () => {
    component.toggle(true);
    fixture.detectChanges();
    expect(notificationsServiceSpy.getInstance).toHaveBeenCalledTimes(1);
    expect(nullNotificationServiceSpy.subscribeTo).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe to push notifications', async () => {
    component.toggle(false);
    fixture.detectChanges();
    expect(notificationsServiceSpy.getInstance).toHaveBeenCalledTimes(1);
    expect(nullNotificationServiceSpy.unsubscribeFrom).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Change Language button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Change Language');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Log Out button clicked', () => {
    component.profile = profile;
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Log Out');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get data of users when ionViewWillEnter is called', async () => {
    await component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.profile).toEqual(profile);
  });

  it('should set language when Change Language button is clicked', async () => {
    fakeModalController.modifyReturns(null, { role: 'selected', data: 'es' });
    const button = fixture.debugElement.query(By.css('ion-button[name="Change Language"]'));
    button.nativeElement.click();
    await fixture.whenStable();
    expect(languageServiceSpy.setLanguage).toHaveBeenCalledTimes(1);
  });

  it('should disable language button when clicked', async () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('ion-button[name="Change Language"]'));
    button.nativeElement.click();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(button.properties['disabled']).toEqual(true);
  });

  it('should show modal if user has wallet and modal list is empty when Log Out button is clicked', async () => {
    component.profile = profile;
    await component.handleLogout();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show modal if user has wallet and is not in modal list when Log Out button is clicked', async () => {
    component.profile = profile;
    await component.handleLogout();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should log out if user does not have a wallet when Log Out button is clicked', async () => {
    component.profile = profile;
    fakeWalletService.modifyReturns(false, {});
    const button = fixture.debugElement.query(By.css('ion-button[name="Log Out"]'));
    button.nativeElement.click();
    await fixture.whenStable();
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('users/login');
  });

  it('should log out if user selected to not see modal in this device when Log Out button is clicked and navigate to users/login', async () => {
    component.profile = profile;
    logOutModalServiceSpy.isShowModalTo.and.returnValue(Promise.resolve(false));
    const button = fixture.debugElement.query(By.css('ion-button[name="Log Out"]'));
    button.nativeElement.click();
    await fixture.whenStable();
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('users/login');
  });

  it('should render app-card-category-menu component', () => {
    fixture.detectChanges();
    const menu = fixture.debugElement.queryAll(By.css('app-card-category-menu'));
    fixture.detectChanges();
    expect(menu.length).toBe(5);
  });

  it('should back to home when back button is clicked', async () => {
    const button = fixture.debugElement.query(By.css('ion-back-button'));
    button.nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/tabs/home');
  });

  it('should navigate to delete account when delete_account button is clicked', async () => {
    const button = fixture.debugElement.query(By.css('ion-button[name="delete_account"]'));
    button.nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('profiles/delete-account');
  });

  it('should set username on enter', async () => {
    await component.ionViewWillEnter();
    expect(component.username).toEqual('Xcapiter 0x012');
  });

  it('should show biometric auth item when bio auth is enabled', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(true);

    await component.ionViewWillEnter();

    const biometricAuthItem = component.itemMenu
      .find((category) => category.id === 'wallet')
      .items.find((item) => item.name === 'BiometricAuth');

    expect(biometricAuthItem.hidden).toBeFalse();
  });

  it('should hide biometric auth item when bio auth is disabled', async () => {
    await component.ionViewWillEnter();

    const biometricAuthItem = component.itemMenu
      .find((category) => category.id === 'wallet')
      .items.find((item) => item.name === 'BiometricAuth');

    expect(biometricAuthItem.hidden).toBeTrue();
  });

  it('should navigate to support page when clicking ux_go_to_contact_support', () => {
    fixture.detectChanges();
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.itemMenu[0].items[1].route).toEqual('/tickets/new-create-support-ticket');
  });

  it('should unsubscribe when leave', () => {
    const nextSpy = spyOn(component.leave$, 'next');
    const completeSpy = spyOn(component.leave$, 'complete');
    component.ionViewWillLeave();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should show address list category when feature flag is enabled', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(true);

    await component.ionViewWillEnter();

    const contactListItem = component.itemMenu.find((category) => category.id === 'contacts');

    expect(contactListItem.showCategory).toBeTrue();
  });

  it('should hide address list category when feature flag is not enabled', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    await component.ionViewWillEnter();

    const contactListItem = component.itemMenu.find((category) => category.id === 'contacts');

    expect(contactListItem.showCategory).toBeFalse();
  });

  it('should show button if update available', async () => {
    component.isNative = true;
    component.showButton = true;
    fixture.detectChanges();
    await component.ionViewWillEnter();
    const button = fixture.debugElement.query(By.css('ion-text[name="Update"]'));
    expect(button).toBeTruthy();
  });

  it('should not show button if up to date', async () => {
    component.isNative = true;
    const availability = {
      updateAvailability: AppUpdateAvailability.UPDATE_NOT_AVAILABLE,
    };
    fixture.detectChanges();
    appUpdateSpy.getAppUpdateInfo.and.returnValue(availability);
    await component.ionViewWillEnter();
    const button = fixture.debugElement.query(By.css('ion-text[name="Update"]'));
    expect(button).toBeFalsy();
  });

  it('should get actual version on init', async () => {
    await component.ionViewWillEnter();
    expect(appVersionInjectableSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should update app when button is available and is clicked', async () => {
    component.isNative = true;
    component.showButton = true;
    fixture.detectChanges();
    await component.ionViewWillEnter();
    fixture.debugElement.query(By.css('ion-text[name="Update"]')).nativeElement.click();
    expect(updateAppServiceSpy.update).toHaveBeenCalledTimes(1);
  });
});
