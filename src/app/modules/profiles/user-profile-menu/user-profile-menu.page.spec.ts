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
import { CRUD } from 'src/app/shared/services/crud/crud';

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
];

const profile = { email: 'test@mail.com' };

describe('UserProfileMenuPage', () => {
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

  beforeEach(
    waitForAsync(() => {
      logOutModalServiceSpy = jasmine.createSpyObj('LogOutModalService', {
        isShowModalTo: Promise.resolve(true),
        addUserToNotShowModal: Promise.resolve(),
      });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      apiProfilesServiceSpy = jasmine.createSpyObj(
        'ApiProfilesService',
        {getUserData: of(profile)},
      );
      authServiceSpy = jasmine.createSpyObj(
        'AuthService',
        {
          logout: null,
        },
        {
          isLoggedIn: new ReplaySubject<boolean>(1),
        }
      );
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      languageServiceSpy = jasmine.createSpyObj('LanguageService', {
        setInitialAppLanguage: null,
        getLanguages: [],
        setLanguage: null,
        getSelectedLanguage: Promise.resolve('es')
      });

      fakeWalletService = new FakeWalletService(true, {});
      walletServiceSpy = fakeWalletService.createSpy();

      TestBed.configureTestingModule({
        declarations: [UserProfileMenuPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ApiProfilesService, useValue: apiProfilesServiceSpy },
          { provide: AuthService, useValue: authServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: LanguageService, useValue: languageServiceSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: LogOutModalService, useValue: logOutModalServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(UserProfileMenuPage);
      component = fixture.componentInstance;
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

  it('should call trackEvent on trackService when Log Out button clicked', () => {
    component.profile = profile;
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Log Out');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get data of users when ionViewWillEnter is called', () => {
    component.ionViewWillEnter();
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
    await component.logout();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show modal if user has wallet and is not in modal list when Log Out button is clicked', async () => {
    component.profile = profile;
    await component.logout();
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
    component.itemMenu = itemMenu;
    fixture.detectChanges();
    const menu = fixture.debugElement.queryAll(By.css('app-card-category-menu'));
    fixture.detectChanges();
    expect(menu.length).toBe(3);
  });

  it('should back to home when back button is clicked', async () => {
    const button = fixture.debugElement.query(By.css('ion-back-button'));
    button.nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/tabs/home');
  });
});