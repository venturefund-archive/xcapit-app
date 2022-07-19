import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NavigationExtras } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FiatRampsService } from '../../shared-ramps/services/fiat-ramps.service';
import { SelectProviderPage } from './select-provider.page';

const rawOperations: any[] = [
  {
    operation_id: '355',
    operation_type: 'cash-in',
    status: 'pending_by_validate',
    currency_in: 'ARS',
    amount_in: 200.0,
    currency_out: 'USDC',
    amount_out: 1.33288904,
    created_at: '2022-03-22T14:58:44.303Z',
    provider: '1',
    voucher: false,
  },
  {
    operation_id: '364',
    operation_type: 'cash-in',
    status: 'pending_by_validate',
    currency_in: 'ars',
    amount_in: 145.68149073,
    currency_out: 'MATIC',
    amount_out: 1.38660038,
    created_at: '2022-05-13T17:30:23.258Z',
    provider: '1',
    voucher: false,
  },
];

const testForm = {
  valid: {
    provider: 'testProvider',
    country: {
      isoCodeAlpha3: 'ARS'
    } 
  }
} 

describe('SelectProviderPage', () => {
  let component: SelectProviderPage;
  let fixture: ComponentFixture<SelectProviderPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SelectProviderPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });
      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
        trackEvent: Promise.resolve(true),
      });
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsServiceSpy', {
        getUserOperations: of(rawOperations),
      });
      TestBed.configureTestingModule({
        declarations: [SelectProviderPage, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule, ReactiveFormsModule],
        providers: [
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: BrowserService, useValue: browserServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectProviderPage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when ux_vendor_buy_continue is clicked', () => {
    component.form.patchValue(testForm.valid)
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_vendor_buy_continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate to provider url when ux_vendor_buy_continue is clicked', () => {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        country: 'ARS',
      },
    };
    fixture.detectChanges();
    component.form.patchValue(testForm.valid)
    fixture.debugElement.query(By.css('app-select-provider-card')).triggerEventHandler('route', 'test');
    fixture.debugElement.query(By.css("ion-button[name='ux_vendor_buy_continue']")).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['test'], navigationExtras);
  });

  it('should reset form when country is changed', () => {
    const spy = spyOn(component.form.get('provider'), 'reset');
    fixture.debugElement.query(By.css('app-select-provider-card')).triggerEventHandler('changedCountry', 'Argentina');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.form.get('provider').value).toEqual('');
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should get and show operations on ionViewWillEnter', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fiatRampsServiceSpy.getUserOperations).toHaveBeenCalledTimes(1);
    expect(component.operationsList.length).toEqual(2);
  });

  it('should go to Moonpay web when Go To Moonpay History clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Go To Moonpay History"]')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent when Go To Moonpay History clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Moonpay History');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
