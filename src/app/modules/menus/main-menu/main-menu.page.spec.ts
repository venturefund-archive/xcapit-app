import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MainMenuPage } from './main-menu.page';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/modules/usuarios/shared-usuarios/services/auth/auth.service';
import { ReplaySubject, of } from 'rxjs';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { LanguageService } from '../../../shared/services/language/language.service';
import { ModalController, NavController } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { FiatRampsService } from '../../fiat-ramps/shared-ramps/services/fiat-ramps.service';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

const appPages = [
  {
    id: 1,
    name: 'Profile',
    title: 'app.main_menu.user_profile',
    url: '/profiles/user',
    icon: 'ux-user-icon',
    routeDirection: 'forward',
    showInProd: true,
  },
  {
    id: 2,
    name: 'Funds',
    title: 'app.main_menu.funds',
    url: '/tabs/funds',
    icon: 'ux-myfund-icon',
    routeDirection: 'root',
    showInProd: true,
  },
  {
    id: 3,
    name: 'FundsFinished',
    title: 'funds.funds_finished.header',
    url: '/funds/funds-finished',
    icon: 'ux-finalizedfunds-icon',
    routeDirection: 'forward',
    showInProd: true,
  },

  {
    id: 4,
    name: 'DepositAddress',
    title: 'app.main_menu.deposit_address',
    url: '/deposits/currency',
    icon: 'ux-book-icon',
    routeDirection: 'forward',
    showInProd: true,
  },
  {
    id: 5,
    name: 'Support',
    title: 'app.main_menu.help',
    url: '/support/options',
    icon: 'ux-settings-icon',
    routeDirection: 'forward',
    showInProd: true,
  },
  {
    id: 6,
    name: 'BuyCrypto',
    title: 'fiat_ramps.operations_list.header',
    url: '/fiat-ramps/operations',
    icon: 'ux-buysell-icon',
    elementClick: 'buyCrypto',
    showInProd: true,
  },
  {
    id: 7,
    name: 'PasswordChange',
    title: 'app.main_menu.password_change',
    url: '/users/password-change',
    icon: 'ux-key-icon',
    routeDirection: 'forward',
    showInProd: true,
  },
  {
    id: 8,
    name: 'Referrals',
    title: 'app.main_menu.referrals',
    url: '/referrals/summary',
    icon: 'ux-referrals-icon',
    routeDirection: 'root',
    showInProd: true,
  },
  {
    id: 9,
    name: 'Notifications',
    title: 'app.main_menu.notifications',
    url: '/notifications/list',
    icon: 'ux-notifications-icon',
    routeDirection: 'root',
    showInProd: true,
  },
  {
    id: 10,
    name: 'ApiKeysList',
    title: 'app.main_menu.api_keys_managment',
    url: '/apikeys/list',
    icon: 'ux-cog-icon',
    routeDirection: 'root',
    showInProd: true,
  },
  {
    id: 11,
    name: 'Payments',
    title: 'app.main_menu.payment',
    url: '/payment/select-license',
    icon: 'ux-cash-icon',
    routeDirection: 'forward',
    showInProd: false,
  },
];

describe('MainMenuPage', () => {
  let component: MainMenuPage;
  let fixture: ComponentFixture<MainMenuPage>;
  let authServiceMock: any;
  let languageServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<MainMenuPage>;
  let apiApiKeysServiceSpy: any;
  let fiatRampsServiceSpy: any;
  let windowSpy: any;
  let modalControllerMock: any;
  let onDidDismissSpy: any;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      apiApiKeysServiceSpy = jasmine.createSpyObj('ApiApikeysService', ['getAll']);
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', ['userHasOperations']);
      languageServiceSpy = jasmine.createSpyObj('LanguageService', [
        'setInitialAppLanguage',
        'getLanguages',
        'setLanguage',
      ]);
      languageServiceSpy.setInitialAppLanguage.and.returnValue(null);
      languageServiceSpy.setInitialAppLanguage.and.returnValue('es');
      languageServiceSpy.setLanguage.and.returnValue(Promise.resolve());
      authServiceMock = {
        isLoggedIn: new ReplaySubject<boolean>(1),
        logout: () => null,
      };
      windowSpy = spyOn(window, 'open');
      onDidDismissSpy = jasmine
        .createSpy('onDidDismiss', () => Promise.resolve({ data: 'en', role: 'selected' }))
        .and.callThrough();
      modalControllerMock = {
        create: jasmine.createSpy('create', () =>
          Promise.resolve({
            present: () => Promise.resolve(),
            onDidDismiss: onDidDismissSpy,
            dismiss: () => Promise.resolve(),
          })
        ),
        dismiss: Promise.resolve(),
      };
      modalControllerMock.create.and.callThrough();
      TestBed.configureTestingModule({
        declarations: [FakeTrackClickDirective, MainMenuPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: AuthService, useValue: authServiceMock },
          { provide: LanguageService, useValue: languageServiceSpy },
          { provide: ModalController, useValue: modalControllerMock },
          { provide: ApiApikeysService, useValue: apiApiKeysServiceSpy },
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
        imports: [TranslateModule.forRoot()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    expect(elms.length).toBe(13);
  });

  it('should show menu-item when "env" is PREPROD', () => {
    component.appPages = appPages;
    component.env = 'PREPROD';
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.menu-item'));
    expect(items.length).toBe(13);
  });

  it('should show menu-item when "showInProd" is true and "env" is "PRODUCCION"', () => {
    component.appPages = appPages;
    component.env = 'PRODUCCION';
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.menu-item'));
    expect(items.length).toBe(12);
  });

  it('should open modal when buyCrypto is clicked and there are no apikeys neither fiat-ramps operations', async () => {
    fiatRampsServiceSpy.userHasOperations.and.returnValue(of({ user_has_operations: false }));
    apiApiKeysServiceSpy.getAll.and.returnValue(of([]));

    component.ionViewWillEnter();
    const button = fixture.debugElement.query(By.css(`ion-item#BuyCrypto`));
    button.nativeElement.click();

    expect(modalControllerMock.create).toHaveBeenCalledTimes(1);
  });

  appPages.forEach((item) => {
    it(`should navigate to ${item.url} when item is clicked`, async () => {
      fiatRampsServiceSpy.userHasOperations.and.returnValue(of({ user_has_operations: true }));
      apiApiKeysServiceSpy.getAll.and.returnValue(of([]));
      component.ionViewWillEnter();

      const button = fixture.debugElement.query(By.css(`ion-item#${item.name}`));
      button.nativeElement.click();

      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(`${item.url}`);
    });
  });

  it('should set language when Change Language item is clicked', async () => {
    const button = fixture.debugElement.query(By.css(`ion-item#ChangeLanguage`));
    button.nativeElement.click();
    await fixture.whenStable();

    expect(languageServiceSpy.setLanguage).toHaveBeenCalledTimes(1);
  });
});
