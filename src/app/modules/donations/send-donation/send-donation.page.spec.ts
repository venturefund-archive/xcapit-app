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
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import { FakeProvider } from 'src/app/shared/models/provider/fake-provider.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { Erc20ProviderInjectable } from '../../defi-investments/shared-defi-investments/models/erc20-provider/injectable/erc20-provider.injectable';
import { FakeERC20Provider } from '../../defi-investments/shared-defi-investments/models/erc20-provider/fake/fake-erc20-provider';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { SendDonationDataService } from '../shared-donations/services/send-donation-data.service';
import { SendDonationPage } from './send-donation.page';
import { SpyProperty } from '../../../../testing/spy-property.spec';
import { FakeActivatedRoute } from '../../../../testing/fakes/activated-route.fake.spec';
import { TokenOperationDataService } from '../../fiat-ramps/shared-ramps/services/token-operation-data/token-operation-data.service';
import { ERC20ContractController } from '../../defi-investments/shared-defi-investments/models/erc20-contract/controller/erc20-contract.controller';
import { FakeContract } from '../../defi-investments/shared-defi-investments/models/fake-contract/fake-contract.model';
import { BigNumber } from 'ethers';
import { ERC20Contract } from '../../defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { rawETHData, rawUSDTData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';

describe('SendDonationPage', () => {
  let component: SendDonationPage;
  let fixture: ComponentFixture<SendDonationPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SendDonationPage>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let erc20ProviderInjectableSpy: jasmine.SpyObj<Erc20ProviderInjectable>;
  let sendDonationDataSpy: jasmine.SpyObj<SendDonationDataService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let causeSpy: jasmine.SpyObj<any>;
  let formDataSpy: jasmine.SpyObj<any>;
  let dynamicPriceFactorySpy: jasmine.SpyObj<DynamicPriceFactory>;
  let dynamicPriceSpy: jasmine.SpyObj<DynamicPrice>;
  let coinsSpy: jasmine.SpyObj<Coin>[];
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;
  let erc20ContractControllerSpy: jasmine.SpyObj<ERC20ContractController>;
  let erc20ContractSpy: jasmine.SpyObj<ERC20Contract>;

  beforeEach(waitForAsync(() => {
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
    tokenOperationDataServiceSpy = jasmine.createSpyObj(
      'TokenOperationDataService',
      {},
      {
        tokenOperationData: { asset: 'MATIC', network: 'MATIC' },
      }
    );
    causeSpy = jasmine.createSpyObj(
      'cause',
      {},
      {
        id: 'unhcr',
        title: 'UNHCR',
        description: 'donations.description_cause.info.unhcr.description',
        addresses: [
          {
            address: '0xFaB6d79902329D7f3242060bb7E6cd2c59E9fA66',
            token: { network: 'ERC20', value: 'ETH' },
          },
        ],
      }
    );
    sendDonationDataSpy = jasmine.createSpyObj(
      'SendDonationDataService',
      {},
      {
        cause: causeSpy.id,
      }
    );
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve(['testAddress']),
    });
    walletServiceSpy = jasmine.createSpyObj('WalletService', {
      balanceOf: Promise.resolve('20'),
      walletExist: Promise.resolve(true),
    });

    fakeActivatedRoute = new FakeActivatedRoute({
      cause: 'unhcr',
      network: 'ERC20',
      value: 'ETH',
    });
    activatedRouteSpy = fakeActivatedRoute.createSpy();

    coinsSpy = [jasmine.createSpyObj('Coin', {}, rawETHData), jasmine.createSpyObj('Coin', {}, rawUSDTData)];

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: coinsSpy,
      getCoin: JSON.parse(JSON.stringify(causeSpy.addresses[0].token)),
      getGasPrice: Promise.resolve('100000000000'),
      getNativeTokenFromNetwork: JSON.parse(JSON.stringify(rawETHData)),
      getPrices: of({ prices: { USDT: 1, ETH: 1, BTC: 1 } }),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    erc20ContractSpy = jasmine.createSpyObj('ERC20Contract', {
      value: new FakeContract({ transfer: () => Promise.resolve(BigNumber.from('10')) }),
    });

    erc20ContractControllerSpy = jasmine.createSpyObj('ERC20ProviderController', {
      new: erc20ContractSpy,
    });
    erc20ProviderInjectableSpy = jasmine.createSpyObj('ERC20ProviderController', {
      create: new FakeERC20Provider(null, new FakeProvider('100000000')),
    });
    dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(4000) });
    fakeModalController = new FakeModalController({ data: 'fake_password' });
    modalControllerSpy = fakeModalController.createSpy();

    dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(2) });

    dynamicPriceFactorySpy = jasmine.createSpyObj('DynamicPriceFactory', {
      new: dynamicPriceSpy,
    });

    TestBed.configureTestingModule({
      declarations: [SendDonationPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: Erc20ProviderInjectable, useValue: erc20ProviderInjectableSpy },
        { provide: ERC20ContractController, useValue: erc20ContractControllerSpy },
        { provide: SendDonationDataService, useValue: sendDonationDataSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: DynamicPriceFactory, useValue: dynamicPriceFactorySpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SendDonationPage);
    component = fixture.componentInstance;
    component.causes = [causeSpy];
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

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

  it('should get cause , network, and value on ionViewWillEnter', async () => {
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    expect(component.cause).toEqual(causeSpy);
    expect(component.token).toEqual(coinsSpy[0]);
    expect(component.selectedNetwork).toEqual('ERC20');
    expect(component.causeAddress).toEqual('0xFaB6d79902329D7f3242060bb7E6cd2c59E9fA66');
  });

  it('should get token balance when token is native on ionViewWillEnter', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick(1500);
    expect(component.balance).toEqual(10);
    discardPeriodicTasks();
    flush();
  }));

  it('should get token balance when token isnt native on ionViewWillEnter', fakeAsync(() => {
    fakeActivatedRoute.modifySnapshotParams({ network: 'ERC20', value: 'USDT' });
    new SpyProperty(causeSpy, 'addresses').value().and.returnValue([
      {
        token: { network: 'ERC20', value: 'USDT' },
      },
    ]);
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick(1500);
    expect(component.balance).toEqual(20);
    discardPeriodicTasks();
    flush();
  }));

  it('should get native fee on ionViewWillEnter when token is native', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();
    expect(component.token).toEqual(coinsSpy[0]);
    expect(component.fee).toEqual(10);
    discardPeriodicTasks();
    flush();
  }));

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
    apiWalletServiceSpy.getGasPrice.and.returnValue(Promise.resolve('10000000000000'));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not show informative modal of fees when the native token balance is lower than the cost of fees', async () => {
    walletServiceSpy.balanceOf.and.returnValue(Promise.resolve('0.001'));
    apiWalletServiceSpy.getGasPrice.and.returnValue(Promise.resolve('100000'));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });

  it('should do nothing when an invalid form is submitted', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    tick();
    component.form.patchValue({ amount: null });
    fixture.debugElement.query(By.css('ion-button[name="ux_donations_amount"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
    flush();
  }));

  it('should unsubscribe when leave', () => {
    const nextSpy = spyOn(component.leave$, 'next');
    const completeSpy = spyOn(component.leave$, 'complete');
    component.ionViewWillLeave();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
});
