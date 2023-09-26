import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { rawTokensData, rawUSDCData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { SendWarrantyPage } from './send-warranty.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeModal } from '../../../shared/models/modal/fake/fake-modal';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { ModalFactoryInjectable } from 'src/app/shared/models/modal/injectable/modal-factory.injectable';
import { FakeModalFactory } from '../../../shared/models/modal/factory/fake/fake-modal-factory';
import { FakeLender } from 'src/app/shared/models/lender/fake/fake-lender';
import { ActiveLenderInjectable } from 'src/app/shared/models/active-lender/injectable/active-lender.injectable';
import { rawLender } from 'src/app/shared/models/lender/raw-lender.fixture';
import {
  FakeWarrantyDataService,
  WarrantyDataService,
} from '../shared-warranties/services/send-warranty-data/send-warranty-data.service';
import { rawBlockchainsData } from '../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { BlockchainRepo } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { DefaultBlockchains } from '../../swaps/shared-swaps/models/blockchains/default/default-blockchains';
import { WarrantiesService } from '../shared-warranties/services/warranties.service';

describe('SendWarrantyPage', () => {
  let component: SendWarrantyPage;
  let fixture: ComponentFixture<SendWarrantyPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SendWarrantyPage>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let dynamicPriceFactorySpy: jasmine.SpyObj<DynamicPriceFactory>;
  let dynamicPriceSpy: jasmine.SpyObj<DynamicPrice>;
  let formDataSpy: jasmine.SpyObj<any>;
  let fakeBalanceModal: FakeModal;
  let modalFactoryInjectableSpy: jasmine.SpyObj<ModalFactoryInjectable>;
  let activeLenderInjectableSpy: jasmine.SpyObj<ActiveLenderInjectable>;
  let fakeWarrantyDataService: FakeWarrantyDataService;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let warrantyServiceSpy: jasmine.SpyObj<WarrantiesService>;
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

  beforeEach(waitForAsync(() => {
    activeLenderInjectableSpy = jasmine.createSpyObj('ActiveLenderInjectable', {
      create: {
        value: () => Promise.resolve(new FakeLender()),
        name: () => Promise.resolve('a_lender'),
      },
    });

    fakeWarrantyDataService = new FakeWarrantyDataService();

    formDataSpy = jasmine.createSpyObj(
      'formData',
      {},
      {
        valid: {
          amount: 29,
          quoteAmount: 29,
          dni: 33333333,
        },
        insufficient_balance: {
          amount: 500,
          quoteAmount: 290,
          dni: 33333333,
        },
      }
    );

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    walletServiceSpy = jasmine.createSpyObj('WalletService', {
      balanceOf: Promise.resolve('200'),
      walletExist: Promise.resolve(true),
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getPrices: of({ prices: { USDC: 1 } }),
      getCoins: rawTokensData,
      getCoin: rawUSDCData,
    });

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve(['testAddress']),
    });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(),
    });

    dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(1) });

    dynamicPriceFactorySpy = jasmine.createSpyObj('DynamicPriceFactory', {
      new: dynamicPriceSpy,
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    fakeBalanceModal = new FakeModal();
    modalFactoryInjectableSpy = jasmine.createSpyObj('ModalFactoryInjectable', {
      create: new FakeModalFactory(fakeBalanceModal),
    });

    warrantyServiceSpy = jasmine.createSpyObj('WarrantyService', { verifyWarranty: of({ amount: 0 }) });

    TestBed.configureTestingModule({
      declarations: [SendWarrantyPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ModalFactoryInjectable, useValue: modalFactoryInjectableSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: ActiveLenderInjectable, useValue: activeLenderInjectableSpy },
        { provide: DynamicPriceFactory, useValue: dynamicPriceFactorySpy },
        { provide: WarrantyDataService, useValue: fakeWarrantyDataService },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: WarrantiesService, useValue: warrantyServiceSpy },
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
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('warranties/warranty-summary');
    discardPeriodicTasks();
  }));

  it('should save lender in warranty service', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();
    component.form.patchValue(formDataSpy.valid);
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_amount"]')).nativeElement.click();
    expect(fakeWarrantyDataService.data.lender).toEqual('naranjax');
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

  it('should open insufficient balance modal when enter amount is greater than balance', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();
    component.form.patchValue({ amount: formDataSpy.insufficient_balance.amount });
    expect(fakeBalanceModal.calls).toEqual(1);
    discardPeriodicTasks();
  }));

  it('should open insufficient balance modal when enter quoteAmount is greater than balance', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();
    component.form.patchValue({ quoteAmount: formDataSpy.insufficient_balance.quoteAmount });

    expect(fakeBalanceModal.calls).toEqual(1);

    discardPeriodicTasks();
  }));

  it('should autocomplete dni field when user has information on storage', fakeAsync(() => {
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve('12345678'));
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();

    expect(component.form.value.dni).toEqual('12345678');
    discardPeriodicTasks();
  }));

  it('should get minimum warranty amount of the lender', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();

    expect(component.minimumWarrantyAmount).toEqual(rawLender.minAmount.toString());
    discardPeriodicTasks();
  }));

  it('should ignore lender minimum amount if user already has a warranty', async () => {
    warrantyServiceSpy.verifyWarranty.and.returnValue(of({ amount: 5.88 }));
    component.ionViewWillEnter();
    fixture.detectChanges();

    expect(component.minimumWarrantyAmount).toBeFalsy();
  });
});
