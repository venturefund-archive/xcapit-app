import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';
import { FakeProvider } from 'src/app/shared/models/provider/fake-provider.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ERC20ProviderController } from '../../defi-investments/shared-defi-investments/models/erc20-provider/controller/erc20-provider.controller';
import { FakeERC20Provider } from '../../defi-investments/shared-defi-investments/models/erc20-provider/fake/fake-erc20-provider';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { SendDonationDataService } from '../shared-donations/services/send-donation-data.service';
import { SendDonationPage } from './send-donation.page';

describe('SendDonationPage', () => {
  let component: SendDonationPage;
  let fixture: ComponentFixture<SendDonationPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SendDonationPage>;
  let activatedRouteMock: any;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let erc20ProviderControllerSpy: jasmine.SpyObj<ERC20ProviderController>;
  let dynamicPriceSpy: jasmine.SpyObj<DynamicPrice>;
  let createDynamicPriceSpy: jasmine.Spy<any>;
  let sendDonationDataSpy: any;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let causesSpy: jasmine.SpyObj<any>;
  let formDataSpy: jasmine.SpyObj<any>;

  beforeEach(
    waitForAsync(() => {
      formDataSpy = jasmine.createSpyObj(
        'formData',
        {},
        {
          valid: {
            amount: 0.01,
            quoteAmount: 29,
          },
        }
      );
      causesSpy = jasmine.createSpyObj(
        'causes',
        {},
        {
          id: 'unhcr',
          title: 'UNHCR',
          description: 'donations.description_cause.info.unhcr.description',
          token: { network: 'ERC20', native: true },
        }
      );
      sendDonationDataSpy = { data: causesSpy };
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getWalletsAddresses: Promise.resolve(['testAddress']),
      });
      walletServiceSpy = jasmine.createSpyObj('WalletService', {
        balanceOf: Promise.resolve('10'),
        walletExist: Promise.resolve(true),
      });
      activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', ['get']);
      activatedRouteMock.snapshot = {
        queryParamMap: convertToParamMap({
          cause: 'unhcr',
        }),
      };
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getCoin: JSON.parse(JSON.stringify(causesSpy.token)),
        getGasPrice: of({ gas_price: 100000000000 }),
        getPrices: of({ prices: { USDT: 1, ETH: 1, BTC: 1 } }),
      });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      erc20ProviderControllerSpy = jasmine.createSpyObj('ERC20ProviderController', {
        new: new FakeERC20Provider(null, new FakeProvider('100000000')),
      });
      dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(4000) });
      fakeModalController = new FakeModalController({ data: 'fake_password' });
      modalControllerSpy = fakeModalController.createSpy();
      TestBed.configureTestingModule({
        declarations: [SendDonationPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: ERC20ProviderController, useValue: erc20ProviderControllerSpy },
          { provide: SendDonationDataService, useValue: sendDonationDataSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(SendDonationPage);
      component = fixture.componentInstance;
      component.causes = [causesSpy];
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      createDynamicPriceSpy = spyOn(component, 'createDynamicPrice').and.returnValue(dynamicPriceSpy);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when ux_donations_amount Button clicked', () => {
    spyOn(component, 'submitForm');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_donations_amount');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get data of cause on ionViewWillEnter', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.data).toEqual(causesSpy);
  });

  it('should set network to show on page on ionViewWillEnter', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.selectedNetwork).toEqual(causesSpy.token.network);
    expect(component.networks).toEqual([causesSpy.token.network]);
  });

  it('should set token on ionViewWillEnter if there is data', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.token).toEqual(causesSpy.token);
  });

  it('should get token balance on ionViewWillEnter', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick(1500);
    expect(component.balance).toEqual(10);
    discardPeriodicTasks();
    flush();
  }));

  it('should get native fee on ionViewWillEnter when token is native', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();
    expect(component.token).toEqual(causesSpy.token);
    expect(component.fee).toEqual(10);
    discardPeriodicTasks();
    flush();
  }));

  it('should create dynamic price', async () => {
    await component.ionViewWillEnter();
    createDynamicPriceSpy.and.callThrough();
    expect(component.createDynamicPrice()).toBeTruthy();
  });

  it('should save donation data and navigate when ux_donations_amount Button clicked and form valid', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();
    component.form.patchValue(formDataSpy.valid);
    fixture.debugElement.query(By.css('ion-button[name="ux_donations_amount"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/donations/summary-data']);
    flush();
  }));

  it('should show informative modal of fees when the native token balance is bigger than the cost of fees', async () => {
    walletServiceSpy.balanceOf.and.returnValue(Promise.resolve('0.001'));
    apiWalletServiceSpy.getGasPrice.and.returnValue(of({ gas_price: 10000000000000 }));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not show informative modal of fees when the native token balance is lower than the cost of fees', async () => {
    walletServiceSpy.balanceOf.and.returnValue(Promise.resolve('0.001'));
    apiWalletServiceSpy.getGasPrice.and.returnValue(of({ gas_price: 100000 }));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });
});
