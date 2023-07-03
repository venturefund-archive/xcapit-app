import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { FakeProviders } from '../shared-ramps/models/providers/fake/fake-providers';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { KriptonOperationDetailPage } from './kripton-operation-detail.page';
import { ScanUrlOf } from '../../wallets/shared-wallets/models/scan-url-of/scan-url-of';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { JsonRpcProviderInjectable } from '../../wallets/shared-wallets/models/json-rpc-provider/injectable/json-rpc-provider.injectable';
import { GasStationOfFactory } from '../../swaps/shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { fixedGasPriceTo } from 'src/testing/fixed-gas-price.spec';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { Erc20ProviderInjectable } from '../../defi-investments/shared-defi-investments/models/erc20-provider/injectable/erc20-provider.injectable';
import { ERC20ContractInjectable } from '../../defi-investments/shared-defi-investments/models/erc20-contract/injectable/erc20-contract.injectable';
import { FakeERC20Provider } from '../../defi-investments/shared-defi-investments/models/erc20-provider/fake/fake-erc20-provider';
import { FakeContract } from '../../defi-investments/shared-defi-investments/models/fake-contract/fake-contract.model';
import { BigNumber } from 'ethers';
import { ERC20Contract } from '../../defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { BankAccount } from '../shared-ramps/types/bank-account.type';
import { DefaultBlockchains } from '../../swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainRepo } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { rawBlockchainsData } from '../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { FakeEthersProvider } from 'src/app/shared/models/ethers-providers/fake/fake-ethers-provider';
import { FakeProvider } from 'src/app/shared/models/provider/fake-provider.spec';
import { rawMATICData, rawTokensData, rawUSDCData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { rawCashOut } from '../shared-ramps/fixtures/raw-operation-data';

describe('KriptonOperationDetailPage', () => {
  let component: KriptonOperationDetailPage;
  let fixture: ComponentFixture<KriptonOperationDetailPage>;
  let fakeRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let fakeProviders: FakeProviders;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let storageOperationServiceSpy: jasmine.SpyObj<StorageOperationService>;
  let kriptonStorageSpy: jasmine.SpyObj<KriptonStorageService>;
  let testOperation: FiatRampOperation;
  let cashOutOperation: FiatRampOperation;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let jsonRpcProviderInjectableSpy: jasmine.SpyObj<JsonRpcProviderInjectable>;
  let gasStationOfFactorySpy: jasmine.SpyObj<GasStationOfFactory>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let erc20ProviderInjectableSpy: jasmine.SpyObj<Erc20ProviderInjectable>;
  let erc20ContractInjectableSpy: jasmine.SpyObj<ERC20ContractInjectable>;
  let erc20ContractSpy: jasmine.SpyObj<ERC20Contract>;

  const weiGasPriceTestValue = '100000000000';

  const availableKriptonCurrencies = [
    {
      network: 'BSC',
      currencies: ['USDT', 'DAI'],
    },
    {
      network: 'MATIC',
      currencies: ['USDC', 'MATIC'],
    },
  ];

  const userBankData: BankAccount = {
    id: 6,
    country: 'ARG',
    currency_id: 'ars',
    name: 'Santander',
    account_type: 'Ahorro',
    account_number: '**************0990',
  };

  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

  beforeEach(waitForAsync(() => {
    testOperation = {
      operation_id: 678,
      operation_type: 'cash-in',
      status: 'request',
      currency_in: 'ARS',
      amount_in: 500.0,
      currency_out: 'USDC',
      amount_out: 100.0,
      fiat_fee: 4.0,
      created_at: new Date('2021-02-27T10:02:49.719Z'),
      provider: '1',
      voucher: false,
      wallet_address: '0xeeeeeeeee',
      network: 'MATIC',
    };

    cashOutOperation = {
      operation_id: 678,
      operation_type: 'cash-out',
      status: 'request',
      currency_in: 'USDC',
      amount_in: 100.0,
      currency_out: 'ARS',
      amount_out: 500.0,
      created_at: new Date('2021-02-27T10:02:49.719Z'),
      provider: '1',
      wallet_address: '0xeeeeeeeee',
      network: 'MATIC',
      payment_method_id: 1,
      voucher: null,
      kripton_wallet: '0xKriptonTestWallet',
      fiat_fee: 1,
      external_code: 'anExternalCode'
    };

    fakeRoute = new FakeActivatedRoute();
    activatedRouteSpy = fakeRoute.createSpy();
    fakeRoute.modifySnapshotParams('1');
    fakeProviders = new FakeProviders(
      rawProvidersData,
      rawProvidersData.find((provider) => provider.alias === 'kripton'),
      null,
      of([
        {
          code: 'PX',
          paymentType: 'VOUCHER',
        },
      ])
    );

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: fakeProviders,
    });

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoin: rawUSDCData,
      getCoins: rawTokensData,
    });

    storageOperationServiceSpy = jasmine.createSpyObj('StorageOperationService', {
      updateData: null,
    });

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      setProvider: null,
      getUserSingleOperation: of([testOperation]),
      getProvider: rawProvidersData[1],
      getKriptonAvailableCurrencies: of(availableKriptonCurrencies),
      getUserBank: of(userBankData),
      getAddressByVoucher: of({ data: { to: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F' } }),
    });

    kriptonStorageSpy = jasmine.createSpyObj('KriptonStorageService', {
      get: Promise.resolve(),
    });
    kriptonStorageSpy.get.withArgs('email').and.resolveTo('test@test.com');
    kriptonStorageSpy.get.withArgs('access_token').and.resolveTo('test');

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    jsonRpcProviderInjectableSpy = jasmine.createSpyObj('JsonRpcProviderInjectable', {
      create: new FakeEthersProvider(),
    });

    gasStationOfFactorySpy = jasmine.createSpyObj('GasStationOfFactory', {
      create: fixedGasPriceTo(weiGasPriceTestValue),
    });

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve(['testAddress']),
    });

    erc20ProviderInjectableSpy = jasmine.createSpyObj('Erc20ProviderInjectable', {
      create: new FakeERC20Provider(null, new FakeProvider('100000000')),
    });

    erc20ContractSpy = jasmine.createSpyObj('ERC20Contract', {
      value: new FakeContract({ transfer: () => Promise.resolve(BigNumber.from('10')) }),
    });

    erc20ContractInjectableSpy = jasmine.createSpyObj('ERC20ProviderInjectable', {
      create: erc20ContractSpy,
    });

    TestBed.configureTestingModule({
      declarations: [KriptonOperationDetailPage, FakeTrackClickDirective, FormattedAmountPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: StorageOperationService, useValue: storageOperationServiceSpy },
        { provide: KriptonStorageService, useValue: kriptonStorageSpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: JsonRpcProviderInjectable, useValue: jsonRpcProviderInjectableSpy },
        { provide: GasStationOfFactory, useValue: gasStationOfFactorySpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: Erc20ProviderInjectable, useValue: erc20ProviderInjectableSpy },
        { provide: ERC20ContractInjectable, useValue: erc20ContractInjectableSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KriptonOperationDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track screenview event on init', async () => {
    await component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should show operation details on init', async () => {
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const coinComponentEl = fixture.debugElement.query(By.css('app-coin-content-item'));
    const state = fixture.debugElement.query(By.css('app-operation-status-chip'));
    const toast = fixture.debugElement.query(By.css('app-operation-status-alert'));
    const quotations = fixture.debugElement.query(
      By.css('.kod__card-container__card__quotation__container__content > ion-text')
    ).nativeElement.innerText;
    const address = fixture.debugElement.query(
      By.css('.kod__card-container__card__address__container__content > ion-text')
    ).nativeElement.innerText;
    const operationNumber = fixture.debugElement.query(
      By.css('.kod__card-container__card__provider__container__operation__content > ion-text')
    ).nativeElement.innerText;
    const date = fixture.debugElement.query(
      By.css('.kod__card-container__card__date__container__date__content > ion-text')
    ).nativeElement.innerText;
    const hour = fixture.debugElement.query(
      By.css('.kod__card-container__card__date__container__hour__content > ion-text')
    ).nativeElement.innerText;

    expect(coinComponentEl.nativeElement.currencyOut).toContain(testOperation.currency_out);
    expect(coinComponentEl.nativeElement.currencyIn).toContain(testOperation.currency_in);
    expect(coinComponentEl.nativeElement.amount).toEqual(testOperation.amount_out);
    expect(coinComponentEl.nativeElement.quoteAmount).toEqual(testOperation.amount_in);
    expect(coinComponentEl.nativeElement.network).toContain(testOperation.network);
    expect(state).toBeTruthy();
    expect(toast).toBeTruthy();
    expect(quotations).toContain('1 USDC = 4.81 ARS');
    expect(address).toContain(testOperation.wallet_address);
    expect(operationNumber).toContain(testOperation.operation_id);
    expect(date).toContain('27/02/2021');
    expect(hour).toMatch(/\d\d:\d\d/g);
  });

  it('should redirect to Kripton Support when user clicks ux_goto_kripton_tos button', () => {
    const url = {
      url: 'https://kriptonmarket.com/terms-and-conditions',
    };
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_goto_kripton_tos"]')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith(url);
  });

  it('should navigate back to operations if operation does not exist', async () => {
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(throwError('error'));
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/fiat-ramps/purchases']);
  });

  it('should show info modal when info button is clicked', async () => {
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-icon[name="information-circle"]')).nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show correct text when info button is clicked and status is incomplete', async () => {
    testOperation.status = 'request';
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-icon[name="information-circle"]')).nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(component.description).toEqual(
      `fiat_ramps.operation_status_detail.${testOperation.operation_type}.incomplete.description`
    );
    expect(component.description2).toEqual(
      `fiat_ramps.operation_status_detail.${testOperation.operation_type}.incomplete.description2`
    );
  });

  it('should show correct text when info button is clicked and status is in progress', async () => {
    testOperation.status = 'received';
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-icon[name="information-circle"]')).nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(component.description).toEqual(
      `fiat_ramps.operation_status_detail.${testOperation.operation_type}.in_progress.description`
    );
  });

  it('should show correct text when info button is clicked and status is nullified', async () => {
    testOperation.status = 'refund';
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-icon[name="information-circle"]')).nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(component.description).toEqual(
      `fiat_ramps.operation_status_detail.${testOperation.operation_type}.nullified.description`
    );
  });

  it('should show correct text when info button is clicked and status is cancelled', async () => {
    testOperation.status = 'cancel';
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-icon[name="information-circle"]')).nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(component.description).toEqual(
      `fiat_ramps.operation_status_detail.${testOperation.operation_type}.cancelled.description`
    );
  });

  it('should set operation storage data and redirect to purchase order when event was triggered', async () => {
    const incompleteOperation: FiatRampOperation = { ...testOperation, status: 'request' };
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(of([incompleteOperation]));
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-operation-status-alert')).triggerEventHandler('navigateBy');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/purchase-order/1', {
      animated: false,
    });
    expect(storageOperationServiceSpy.updateData).toHaveBeenCalledTimes(1);
    
  });

  it('should set properly cash out operation storage data', async () => {
    const incompleteOperation: FiatRampOperation = { ...cashOutOperation, status: 'wait' };
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(of([incompleteOperation]));
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-operation-status-alert')).triggerEventHandler('navigateBy');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(storageOperationServiceSpy.updateData).toHaveBeenCalledOnceWith(rawCashOut)
  });

  it('should hide information icon when operation is complete', async () => {
    const completeOperation: FiatRampOperation = { ...testOperation, status: 'complete' };
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(of([completeOperation]));
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const infoIcon = fixture.debugElement.query(By.css('ion-icon[name="information-circle"]'));
    expect(infoIcon).toBeNull();
  });

  it('should open scan when link is clicked', async () => {
    const completeOperation: FiatRampOperation = { ...testOperation, status: 'complete' };
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(of([completeOperation]));
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-item.kod__card-container__card__state')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({
      url: ScanUrlOf.create(component.operation.tx_hash, component.operation.network).value(),
    });
  });

  it('should get bank account if is a cash out operation', async () => {
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(of([cashOutOperation]));
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    expect(fiatRampsServiceSpy.getUserBank).toHaveBeenCalledOnceWith({
      auth_token: 'test',
      email: 'test@test.com',
      payment_method_id: 1,
    });
  });

  it('should set used transaction fee if is a cash out operation and is not an incomplete operation', async () => {
    const completeOperation: FiatRampOperation = { ...cashOutOperation, status: 'complete', tx_hash: 'aHash' };
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(of([completeOperation]));
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    expect(component.fee).not.toBeNull();
  });

  it('should estimate native fee if is a cash out operation and is an incomplete operation', fakeAsync(() => {
    apiWalletServiceSpy.getCoin.and.returnValue(rawMATICData);
    const nativeOperation: FiatRampOperation = { ...cashOutOperation, currency_in: 'MATIC' };
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(of([nativeOperation]));
    component.ionViewWillEnter();
    tick();
    expect(erc20ProviderInjectableSpy.create).toHaveBeenCalledTimes(1);
    expect(component.fee).toEqual(12.5);
  }));

  it('should estimate no native fee if is a cash out operation and is an incomplete operation', fakeAsync(() => {
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(of([cashOutOperation]));
    component.ionViewWillEnter();
    tick();
    expect(erc20ProviderInjectableSpy.create).toHaveBeenCalledTimes(1);
    expect(erc20ContractInjectableSpy.create).toHaveBeenCalledTimes(1);
    expect(component.fee).toEqual(0.000001);
  }));

  it('should set operation storage data and redirect to sell order when event was triggered', async () => {
    const incompleteOperation: FiatRampOperation = { ...cashOutOperation, status: 'wait' };
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(of([incompleteOperation]));
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-operation-status-alert')).triggerEventHandler('navigateBy');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/kripton-summary', {
      animated: false,
    });
    expect(storageOperationServiceSpy.updateData).toHaveBeenCalledTimes(1);
  });
});
