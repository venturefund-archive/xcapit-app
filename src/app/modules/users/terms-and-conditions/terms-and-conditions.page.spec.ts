import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

import { TermsAndConditionsPage } from './terms-and-conditions.page';

const itemsMenu = [
  {
    img: '/assets/img/users/term-and-conditions/logo-xcapit.svg',
    name: 'TyC-Xcapit',
    title: 'profiles.user_profile_menu.terms_and_conditions.tyc',
    route: 'https://www.xcapit.com/terminos-y-condiciones',
    key: 'userAcceptedToS',
    isXcapit: true,
  },
  {
    img: '/assets/img/users/term-and-conditions/icon-2pi.svg',
    name: 'TyC-2pi',
    title: 'profiles.user_profile_menu.terms_and_conditions.2pi.title',
    route: 'https://docs.2pi.network/resources/terms-and-conditions',
    key: '_agreement_2PI_T&C',
  },
];

describe('TermsAndConditionsPage', () => {
  let component: TermsAndConditionsPage;
  let fixture: ComponentFixture<TermsAndConditionsPage>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let ionicStorageSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(waitForAsync(() => {
    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });

    ionicStorageSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      declarations: [TermsAndConditionsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionsPage);
    component = fixture.componentInstance;
    component.items = itemsMenu;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate open browser when button ', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('app-tyc-item-card')).triggerEventHandler('openBrowser', itemsMenu[0].route);

    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: itemsMenu[0].route });
  });

  it('should obtain the providers that your T&C are signed', fakeAsync(() => {
    component.ionViewWillEnter();
    tick();
    fixture.detectChanges();
    expect(component.providerItems.length).toEqual(1);
  }));

  it('should obtain the providers that your T&C are not signed', fakeAsync(() => {
    ionicStorageSpy.get.and.returnValue(Promise.resolve(false));
    component.ionViewWillEnter();
    tick();
    fixture.detectChanges();
    expect(component.providerItems.length).toEqual(0);
  }));
});
