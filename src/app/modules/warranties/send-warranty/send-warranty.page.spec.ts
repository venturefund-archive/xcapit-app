import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { rawMATICData, rawUSDCData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { SendWarrantyPage } from './send-warranty.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import BalanceModalInjectable from 'src/app/shared/models/balance-modal/injectable/balance-modal.injectable';
import { FakeBalanceModal } from '../../../shared/models/balance-modal/fake/fake-balance-modal';
import { BalanceModal } from 'src/app/shared/models/balance-modal/balance-modal.interface';

fdescribe('SendWarrantyPage', () => {
  let component: SendWarrantyPage;
  let fixture: ComponentFixture<SendWarrantyPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SendWarrantyPage>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let dynamicPriceFactorySpy: jasmine.SpyObj<DynamicPriceFactory>;
  let dynamicPriceSpy: jasmine.SpyObj<DynamicPrice>;
  let formBuilder: UntypedFormBuilder;
  let coinsSpy: jasmine.SpyObj<Coin>[];
  let formDataSpy: jasmine.SpyObj<any>;
  let fakeBalanceModal: BalanceModal;
  let balanceModalInjectableSpy: jasmine.SpyObj<BalanceModalInjectable>;

  beforeEach(waitForAsync(() => {
    formDataSpy = jasmine.createSpyObj(
      'formData',
      {},
      {
        valid: {
          amount: 0.01,
          quoteAmount: 29,
          dni: 33333333,
        },
        insufficient_balance: {
          amount: 50,
          quoteAmount: 29,
          dni: 33333333,
        },
      }
    );

    walletServiceSpy = jasmine.createSpyObj('WalletService', {
      balanceOf: Promise.resolve('20'),
      walletExist: Promise.resolve(true),
    });

    formBuilder = new UntypedFormBuilder();

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getPrices: of({ prices: { USDC: 1 } }),
      getCoins: [rawUSDCData],
    });

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve(['testAddress']),
    });

    dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(2) });

    dynamicPriceFactorySpy = jasmine.createSpyObj('DynamicPriceFactory', {
      new: dynamicPriceSpy,
    });

    coinsSpy = [jasmine.createSpyObj('Coin', {}, rawMATICData), jasmine.createSpyObj('Coin', {}, rawUSDCData)];

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    fakeBalanceModal = new FakeBalanceModal(); 
    balanceModalInjectableSpy = jasmine.createSpyObj('BalanceModalInjectable', {
      create: fakeBalanceModal,
    });

    TestBed.configureTestingModule({
      declarations: [SendWarrantyPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: BalanceModalInjectable, useValue: balanceModalInjectableSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SendWarrantyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save warranty data and navigate to summary when ux_warranty_start_amount Button clicked and form valid', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();
    component.form.patchValue(formDataSpy.valid);
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_amount"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['warranties/warranty-summary']);
    discardPeriodicTasks();
  }));

  it('should do nothing when an invalid form is submitted', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();

    component.form.patchValue({ amount: null });
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_amount"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
    discardPeriodicTasks();
  }));

  it('should unsubscribe when leave', () => {
    const nextSpy = spyOn(component.leave$, 'next');
    const completeSpy = spyOn(component.leave$, 'complete');
    component.ionViewWillLeave();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when ux_warranty_start_amount Button clicked', () => {
    spyOn(component, 'submitForm');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_warranty_start_amount');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get USDC token on init', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();
    expect(component.token.value).toEqual('USDC');
    discardPeriodicTasks();
  }));

  it('should open insufficient balance modal when enter amount is greater than balance', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();
    component.form.patchValue({ amount: formDataSpy.insufficient_balance.amount });
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1); // TODO: Ver
    discardPeriodicTasks();
  }));

  it('should open insufficient balance modal when enter quoteAmount is greater than balance', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();
    component.form.patchValue({ quoteAmount: formDataSpy.insufficient_balance.quoteAmount });
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1); // TODO: ver
    discardPeriodicTasks();
  }));
});
