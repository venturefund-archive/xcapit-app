import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';

import { UserRegisterPage } from './user-register.page';

const storageData = {
  valid: {
    data: {
      email: 'test@gmail.com'
    },
    valid: true,
  },
  invalid: {
    data: {
      email: ''
    },
    valid: false,
  },
};
fdescribe('UserRegisterPage', () => {
  let component: UserRegisterPage;
  let fixture: ComponentFixture<UserRegisterPage>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let storageOperationServiceSpy: jasmine.SpyObj<StorageOperationService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(waitForAsync(() => {
    browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getOrCreateUser: of({registration_status: 'COMPLETE'}),
    });

    storageOperationServiceSpy = jasmine.createSpyObj('StorageOperationService', {
      getData: storageData.valid.data,
    });

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    TestBed.configureTestingModule({
      declarations: [UserRegisterPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: StorageOperationService, useValue: storageOperationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    component.userStatus = 'USER_IMAGES'
    const providerEl = fixture.debugElement.query(By.css('div.ur__container__provider > ion-text'));
    const iconEl = fixture.debugElement.query(By.css('div.ur__container__icon > img'));
    const [cardEl1, cardEl2] = fixture.debugElement.queryAll(
      By.css('div.ur__container__card > app-user-register-step-card')
    );
    const disclaimerImgEl = fixture.debugElement.query(By.css('div.ur__container__disclaimer > img'));
    const disclaimerContentEl = fixture.debugElement.query(By.css('div.ur__container__disclaimer > ion-text'));

    expect(providerEl.nativeElement.innerHTML).toContain('fiat_ramps.user_register.provider');
    expect(iconEl.attributes.src).toContain('assets/img/provider-logos/KriptonMarket.svg');
    expect(disclaimerImgEl.attributes.src).toContain('assets/ux-icons/ux-inbox.svg');
    expect(disclaimerContentEl).toBeTruthy();
    expect(cardEl1).toBeTruthy();
    expect(cardEl2).toBeTruthy();
  });

  it('should open browser when link was clicked', () => {
    const disclaimerLinkEl = fixture.debugElement.query(By.css('div.ur__container__disclaimer > ion-text > span'));

    disclaimerLinkEl.nativeElement.click();

    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://cash.kriptonmarket.com/privacy' });
  });

  it('should set user status by email on init', () => {
    component.ionViewWillEnter();
    expect(storageOperationServiceSpy.getData).toHaveBeenCalledTimes(1);
    expect(fiatRampsServiceSpy.getOrCreateUser).toHaveBeenCalledOnceWith({ email: 'test@gmail.com' });
    expect(component.userStatus).toEqual('COMPLETE');
  });

  it('should navigate to wallet page when back button is clicked', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button.ur__button-back')).nativeElement.click();
    
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/tabs/wallet']);
  });
  
  it('should navigate to buy page when ux_go_to_buy_home button is clicked', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_go_to_buy_home"]')).nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/fiat-ramps/purchases']);
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
