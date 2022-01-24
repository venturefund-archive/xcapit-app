import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { OperationsNewPaxfulPage } from './operations-new-paxful.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { BrowserService } from '../../../shared/services/browser/browser.service';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';

const userWallets = {
  aliasDeEstasKey: {
    wallets: {
      BTC: '1Ew261FhBSzF4gmnohBS2AtXXe2',
    },
    apikey_id: 148,
  },
  OtroAliasDistinto: {
    wallets: {
      BTC: '1PxN46d8mJDHrE5xwSgKhVyspP',
    },
    apikey_id: 150,
  },
};

const walletAddress = [
  {
    name: 'aliasDeEstasKey (BTC)',
    apikey_id: 148,
    address: '1Ew261FhBSzF4gmnohBS2AtXXe2',
  },
  {
    name: 'OtroAliasDistinto (BTC)',
    apikey_id: 150,
    address: '1PxN46d8mJDHrE5xwSgKhVyspP',
  },
];

describe('OperationsNewPaxfulPage', () => {
  let component: OperationsNewPaxfulPage;
  let fixture: ComponentFixture<OperationsNewPaxfulPage>;
  let platformServiceSpy: any;
  let fiatRampsServiceSpy: any;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<OperationsNewPaxfulPage>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      platformServiceSpy = jasmine.createSpyObj('PlatformServiceSpy', ['isWeb']);
      fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsServiceSpy', ['getUserWallets', 'getLink', 'setProvider']);
      fiatRampsServiceSpy.getUserWallets.and.returnValue(of({}));
      fiatRampsServiceSpy.getLink.and.returnValue(of({}));
      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });
      TestBed.configureTestingModule({
        declarations: [OperationsNewPaxfulPage, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), IonicModule, ReactiveFormsModule, HttpClientTestingModule],
        providers: [
          { provide: PlatformService, useValue: platformServiceSpy },
          { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: BrowserService, useValue: browserServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(OperationsNewPaxfulPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUserWallets on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(fiatRampsServiceSpy.getUserWallets).toHaveBeenCalledTimes(1);
  });

  it('should format user wallets on ionViewWillEnter', () => {
    fiatRampsServiceSpy.getUserWallets.and.returnValue(of(userWallets));
    component.ionViewWillEnter();
    expect(component.walletAddressSelect).toEqual(walletAddress);
  });

  it('should call goToCreateApikey if no wallets are found', () => {
    const spy = spyOn(component, 'goToCreateApikey');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call navigateBack on goToCreateApikey', () => {
    component.goToCreateApikey();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(1);
  });

  it('should reset form on handleSubmit and form valid', () => {
    const spy = spyOn(component.form, 'reset');
    component.walletAddressSelect = walletAddress;
    component.form.patchValue({ wallet: walletAddress[0].address });
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call openPaxfulLink on handleSubmit and form valid', () => {
    const spy = spyOn(component, 'openPaxfulLink');
    component.walletAddressSelect = walletAddress;
    component.form.patchValue({ wallet: walletAddress[0].address });
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call openPaxfulLink on handleSubmit and form invalid', () => {
    const spy = spyOn(component, 'openPaxfulLink');
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should not open in app browser on handleSubmit and form invalid', () => {
    component.handleSubmit();
    expect(browserServiceSpy.open).toHaveBeenCalledTimes(0);
  });

  it('should call getLink on openPaxfulLink', async () => {
    await component.openPaxfulLink(0);
    expect(fiatRampsServiceSpy.getLink).toHaveBeenCalledTimes(1);
  });

  it('should open in app browser on handleSubmit and form valid', async () => {
    fiatRampsServiceSpy.getLink.and.returnValue(of({ url: 'url' }));
    component.walletAddressSelect = walletAddress;
    component.form.patchValue({ wallet: walletAddress[0].address });
    fixture.detectChanges();
    component.handleSubmit();
    fixture.whenStable().then(() => {
      expect(browserServiceSpy.open).toHaveBeenCalledTimes(1);
    });
  });

  it('should open in app browser on openPaxfulLink with Paxful link', async () => {
    fiatRampsServiceSpy.getLink.and.returnValue(of({ url: 'url' }));
    await component.openPaxfulLink(0);
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: 'url' });
  });

  it('should call success on openPaxfulLink', async () => {
    const spy = spyOn(component, 'success').and.returnValue(Promise.resolve(true));
    await component.openPaxfulLink(0);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Help-paxful link clicked', () => {
    spyOn(component, 'openInfo');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Help-paxful');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should go to success page on success', () => {
    component.success();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/fiat-ramps/new-operation/success-paxful']);
  });
});
