import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MainMenuPage } from './main-menu.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/modules/usuarios/shared-usuarios/services/auth/auth.service';
import { ReplaySubject, of } from 'rxjs';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { LanguageService } from '../../../shared/services/language/language.service';
import { modalControllerMock } from '../../../../testing/spies/modal-controller-mock.spec';
import { ModalController } from '@ionic/angular';
import { By } from '@angular/platform-browser';

const appPages = [
  {
    id: 1,
    title: 'app.main_menu.funds',
    url: '/tabs/funds',
    icon: 'ux-myfund-icon',
    routeDirection: 'root',
    showInProd: true,
  },
  {
    id: 2,
    title: 'funds.funds_finished.header',
    url: '/funds/funds-finished',
    icon: 'ux-finalizedfunds-icon',
    routeDirection: 'forward',
    showInProd: true,
  },
  {
    id: 3,
    title: 'app.main_menu.user_profile',
    url: '/profiles/user',
    icon: 'ux-user-icon',
    routeDirection: 'forward',
    showInProd: false,
  },
  {
    id: 4,
    title: 'app.main_menu.deposit_address',
    url: '/deposits/currency',
    icon: 'ux-book-icon',
    routeDirection: 'forward',
    showInProd: false,
  },
];

describe('MainMenuPage', () => {
  let component: MainMenuPage;
  let fixture: ComponentFixture<MainMenuPage>;
  let authServiceMock: any;
  let trackServiceSpy: any;
  let languageServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<MainMenuPage>;
  let modalControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      trackServiceSpy = jasmine.createSpyObj('LogsService', ['trackView']);
      trackServiceSpy.trackView.and.returnValue(null);
      languageServiceSpy = jasmine.createSpyObj('LanguageService', ['setInitialAppLanguage', 'getLanguages']);
      languageServiceSpy.setInitialAppLanguage.and.returnValue(null);
      languageServiceSpy.setInitialAppLanguage.and.returnValue('es');
      authServiceMock = {
        isLoggedIn: new ReplaySubject<boolean>(1),
        logout: () => null,
      };
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);

      TestBed.configureTestingModule({
        declarations: [MainMenuPage, TrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: AuthService, useValue: authServiceMock },
          { provide: LanguageService, useValue: languageServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([
            { path: 'users/login', component: DummyComponent },
            { path: 'tutorials/help', component: DummyComponent },
            { path: 'tabs/funds', component: DummyComponent },
            { path: 'profiles/user', component: DummyComponent },
            { path: 'deposits/currency', component: DummyComponent },
            { path: 'users/password-change', component: DummyComponent },
            { path: 'referrals/list', component: DummyComponent },
            { path: 'notifications/list', component: DummyComponent },
            { path: 'apikeys/list', component: DummyComponent },
            { path: 'payment/payment-methods', component: DummyComponent },
          ]),
        ],
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
    spyOn(window, 'open');
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

  it('should call checkEmptyApiKeys in clickAction', () => {
    const spyCheckEmptyApiKeys = spyOn(component, 'checkEmptyApiKeys');
    spyCheckEmptyApiKeys.and.returnValue(undefined);
    component.clickAction('buyCrypto');
    expect(component.checkEmptyApiKeys).toHaveBeenCalledTimes(1);
  });

  it('should call openModal in checkEmptyApiKeys', () => {
    const spyOpenModal = spyOn(component, 'openModal');
    spyOpenModal.and.returnValue(undefined);
    component.checkEmptyApiKeys();
    expect(component.openModal).toHaveBeenCalledTimes(1);
  });

  it('show menu-item when "env" is PREPROD', () => {
    component.appPages = appPages;
    component.env = 'PREPROD';
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.menu-item'));
    console.log(items);
    expect(items.length).toBe(6);
  });

  it('show menu-item when "showInProd" is true and "env" is "PRODUCCION"', () => {
    component.appPages = appPages;
    component.env = 'PRODUCCION';
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.menu-item'));
    console.log(items);
    expect(items.length).toBe(4);
  });
});
