import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController, ModalController } from '@ionic/angular';
import { of, ReplaySubject } from 'rxjs';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { AuthService } from 'src/app/modules/usuarios/shared-usuarios/services/auth/auth.service';
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
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';

const testStatus = {
  has_own_funds: true,
  empty_linked_keys: true,
  has_subscribed_funds: false,
  status_name: 'CREATOR',
};

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
        route: 'tickets/create-support-ticket',
        type: 'link',
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
    category_title: 'profiles.user_profile_menu.category_binance_investment',
    icon: 'assets/ux-icons/ux-trending-up.svg',
    showCategory: true,
    items: [
      {
        name: 'Funds',
        text: 'profiles.user_profile_menu.funds',
        route: '/tabs/investments',
        type: 'link',
      },
      {
        name: 'FinishedFunds',
        text: 'profiles.user_profile_menu.finished_funds',
        route: 'funds/funds-finished',
        type: 'link',
      },
      {
        name: 'ApiKeysList',
        text: 'profiles.user_profile_menu.manage_apikey',
        route: '/apikeys/list',
        type: 'link',
      },
    ],
  },
];

const profile = { notifications_enabled: true };

describe('UserProfileMenuPage', () => {
  let component: UserProfileMenuPage;
  let fixture: ComponentFixture<UserProfileMenuPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UserProfileMenuPage>;
  let apiProfilesServiceSpy: any;
  let apiProfilesService: ApiProfilesService;
  let authServiceSpy: any;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiUsuariosServiceSpy: jasmine.SpyObj<ApiUsuariosService>;
  beforeEach(
    waitForAsync(() => {
      apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', {
        status: of(testStatus),
      });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', {
        toggle: of({}),
      });
      apiProfilesServiceSpy = {
        crud: {
          get: () => of(profile),
        },
      };
      authServiceSpy = {
        isLoggedIn: new ReplaySubject<boolean>(1),
        logout: () => null,
      };
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      languageServiceSpy = jasmine.createSpyObj('LanguageService', [
        'setInitialAppLanguage',
        'getLanguages',
        'setLanguage',
      ]);

      fakeWalletService = new FakeWalletService(true, {});
      walletServiceSpy = fakeWalletService.createSpy();

      TestBed.configureTestingModule({
        declarations: [UserProfileMenuPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: ApiProfilesService, useValue: apiProfilesServiceSpy },
          { provide: AuthService, useValue: authServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: LanguageService, useValue: languageServiceSpy },
          { provide: NotificationsService, useValue: notificationsServiceSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(UserProfileMenuPage);
      component = fixture.componentInstance;
      apiProfilesService = TestBed.inject(ApiProfilesService);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Change Language button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Change Language');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set hasFunds to true if user has own funds or subscribed funds', async () => {
      component.ionViewWillEnter();
      fixture.detectChanges();
      expect(component.hasFunds).toEqual(true);
  });


  it('should set hasFunds to false if user dont have own funds or subscribed funds', async () => {
    apiUsuariosServiceSpy.status.and.returnValue(of({
      has_own_funds: false,
      empty_linked_keys: true,
      has_subscribed_funds: false,
      status_name: 'CREATOR',
    }))
    fixture.detectChanges();
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.hasFunds).toEqual(false);
});

  it('should call trackEvent on trackService when Log Out button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Log Out');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get data of users when ionViewWillEnter is called', () => {
    const spy = spyOn(apiProfilesService.crud, 'get');
    spy.and.returnValue(of({}));
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set language when Change Language button is clicked', async () => {
    fakeModalController.modifyReturns(null, { role: 'selected', data: 'es' });
    const button = fixture.debugElement.query(By.css('ion-button[name="Change Language"]'));
    button.nativeElement.click();
    await fixture.whenStable();
    expect(languageServiceSpy.setLanguage).toHaveBeenCalledTimes(1);
  });

  it('should log out when Log Out button is clicked and navigate to users/login', async () => {
    const spy = spyOn(authServiceSpy, 'logout');
    const button = fixture.debugElement.query(By.css('ion-button[name="Log Out"]'));
    button.nativeElement.click();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('users/login');
  });

  it('should render app-card-category-menu component', () => {
    component.itemMenu = itemMenu;
    fixture.detectChanges();
    const menu = fixture.debugElement.queryAll(By.css('app-card-category-menu'));
    fixture.detectChanges();
    expect(menu.length).toBe(4);
  });

  it('should toggle notifications on toggle click', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const toggleEl = fixture.debugElement.query(By.css('ion-toggle'));
    component.form.patchValue({ notificationsEnabled: true });
    await fixture.whenStable();
    expect(notificationsServiceSpy.toggle).toHaveBeenCalledTimes(1);
  });
});
