import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { DefiInvestmentsService } from '../../defi-investments/shared-defi-investments/services/defi-investments-service/defi-investments.service';
import { rawMATICData, rawTokensData, rawUSDCData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { Password } from '../../swaps/shared-swaps/models/password/password';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletBalanceService } from '../../wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { WalletTransactionsService } from '../../wallets/shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { SummaryWarrantyData } from '../send-warranty/interfaces/summary-warranty-data.interface';
import { WarrantyDataService } from '../shared-warranties/services/send-warranty-data/send-warranty-data.service';
import { WarrantiesService } from '../shared-warranties/services/warranties.service';
import { WarrantySummaryPage } from './warranty-summary.page';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeLender } from 'src/app/shared/models/lender/fake/fake-lender';
import { ActiveLenderInjectable } from 'src/app/shared/models/active-lender/injectable/active-lender.injectable';
import { ActiveLender } from '../../../shared/models/active-lender/active-lender';
import { rawLender } from '../../../shared/models/lender/raw-lender.fixture';
import { rawBlockchainsData } from '../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { BlockchainRepo } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { DefaultBlockchains } from '../../swaps/shared-swaps/models/blockchains/default/default-blockchains';
import { WalletsFactory } from '../../wallets/shared-wallets/models/wallets/factory/wallets.factory';
import { FakeWallet } from '../../wallets/shared-wallets/models/wallet/fake/fake-wallet';

describe('WarrantySummaryPage', () => {
  let component: WarrantySummaryPage;
  let fixture: ComponentFixture<WarrantySummaryPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService>;
  let warrantyDataServiceSpy: jasmine.SpyObj<WarrantyDataService>;
  let warrantyServiceSpy: jasmine.SpyObj<WarrantiesService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let defiInvestmentServiceSpy: jasmine.SpyObj<DefiInvestmentsService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let activeLenderInjectableSpy: jasmine.SpyObj<ActiveLenderInjectable>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let walletsFactorySpy: jasmine.SpyObj<WalletsFactory>;
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

  const aPassword = new Password('aPassword');
  const summaryData: SummaryWarrantyData = {
    amount: 10,
    coin: rawUSDCData,
    user_dni: 1234567,
    quoteAmount: 10,
    quoteAmountWithoutCost: 9.8,
    service_cost: 0.2,
    amountWithoutCost: 9.8,
    lender: 'aLender',
    currency: 'USDC',
    blockchain: 'MATIC',
  };
  const transactionData: SummaryWarrantyData = {
    wallet: '0x00001',
    amount: 9.8,
    service_cost: 0.2,
    transaction_hash: 'someHash',
    user_dni: 1234567,
    lender: 'aLender',
    currency: 'USDC',
    blockchain: 'MATIC',
  };

  const _confirmButton = () =>
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_confirm"]')).nativeElement;

  beforeEach(waitForAsync(() => {
    activeLenderInjectableSpy = jasmine.createSpyObj('ActiveLenderInjectable', {
      create: { value: () => new FakeLender() },
    });

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    fakeModalController = new FakeModalController(null, { data: aPassword });
    modalControllerSpy = fakeModalController.createSpy();

    walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionService', {
      send: Promise.resolve({ wait: () => Promise.resolve({ transactionHash: 'someHash' }) }),
      canAffordSendTx: Promise.resolve(true),
      canAffordSendFee: Promise.resolve(true),
    });

    defiInvestmentServiceSpy = jasmine.createSpyObj('DefiInvesmentService', {
      fundWallet: of(),
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getNativeTokenFromNetwork: rawMATICData,
      getCoin: rawUSDCData,
      getCoins: rawTokensData,
    });

    walletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', { balanceOf: Promise.resolve('51') });

    warrantyDataServiceSpy = jasmine.createSpyObj('WarrantyDataService', {}, { data: summaryData });

    warrantyServiceSpy = jasmine.createSpyObj('WarrantyService', { createWarranty: of({ transactionData }) });

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve('0x00001'),
    });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
      get: Promise.resolve(),
    });

    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', { getFeatureFlag: true });
    remoteConfigSpy.getFeatureFlag.withArgs('ff_fundFaucetOnWarranties').and.returnValue(true);
    remoteConfigSpy.getFeatureFlag.withArgs('ff_deposit_to_xscrow').and.returnValue(false);

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    walletsFactorySpy = jasmine.createSpyObj('WalletsFactory', {
      create: { oneBy: () => Promise.resolve(new FakeWallet()) },
    });

    TestBed.configureTestingModule({
      declarations: [WarrantySummaryPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
        { provide: WarrantyDataService, useValue: warrantyDataServiceSpy },
        { provide: WarrantiesService, useValue: warrantyServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: DefiInvestmentsService, useValue: defiInvestmentServiceSpy },
        { provide: WalletBalanceService, useValue: walletBalanceServiceSpy },
        { provide: RemoteConfigService, useValue: remoteConfigSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: ActiveLenderInjectable, useValue: activeLenderInjectableSpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: WalletsFactory, useValue: walletsFactorySpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WarrantySummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data and calculate warranty amounts correctly on init', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();

    expect(component.warrantyData).toEqual(summaryData);
  });

  it('should send warranty to safe wallet if ff_deposit_to_xscrow is false', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();

    _confirmButton().click();
    await fixture.whenRenderingDone();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledOnceWith(
      aPassword.value(),
      10,
      new FakeLender().depositAddress(),
      summaryData.coin
    );
    expect(warrantyServiceSpy.createWarranty).toHaveBeenCalledTimes(1);
  });

  it('should deposit warranty to xscrow if ff_deposit_to_xscrow is true', async () => {
    remoteConfigSpy.getFeatureFlag.withArgs('ff_deposit_to_xscrow').and.returnValue(true);

    await component.ionViewWillEnter();
    fixture.detectChanges();

    _confirmButton().click();
    await fixture.whenRenderingDone();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
    expect(warrantyServiceSpy.createWarranty).toHaveBeenCalledTimes(1);
  });

  it('should disabled loading when ux_warranty_start_confirm button is clicked and password undefined', async () => {
    fakeModalController.modifyReturns(null, { data: undefined });
    await component.ionViewWillEnter();
    fixture.detectChanges();

    _confirmButton().click();
    await fixture.whenRenderingDone();

    expect(component.loading).toBeFalsy();
  });

  it('should not fund wallet if ff_fundFaucetOnWarranties is false', async () => {
    remoteConfigSpy.getFeatureFlag.withArgs('ff_fundFaucetOnWarranties').and.returnValue(false);
    await component.ionViewWillEnter();
    fixture.detectChanges();

    _confirmButton().click();
    await fixture.whenRenderingDone();

    expect(defiInvestmentServiceSpy.fundWallet).toHaveBeenCalledTimes(0);
  });

  it('should fund wallet and create warranty when ux_warranty_start_confirm button is clicked and password is correct', async () => {
    walletTransactionsServiceSpy.canAffordSendFee.and.resolveTo(false);
    await component.ionViewWillEnter();
    fixture.detectChanges();

    _confirmButton().click();
    await fixture.whenRenderingDone();

    expect(defiInvestmentServiceSpy.fundWallet).toHaveBeenCalledTimes(1);
    expect(warrantyServiceSpy.createWarranty).toHaveBeenCalledOnceWith(transactionData);
  });

  it('should show generic error modal when handleSubmit and a non-blockchain error happens', async () => {
    walletTransactionsServiceSpy.send.and.throwError('Test');
    const spy = spyOn(component, 'openErrorModal').and.callThrough();
    await component.ionViewWillEnter();
    fixture.detectChanges();

    _confirmButton().click();
    await fixture.whenRenderingDone();

    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledOnceWith(
      aPassword.value(),
      10,
      new FakeLender().depositAddress(),
      summaryData.coin
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show generic error modal when handleSubmit and address is invalid', async () => {
    const spy = spyOn(component, 'openErrorModal').and.callThrough();
    activeLenderInjectableSpy.create.and.returnValue({
      value: () => Promise.resolve(new FakeLender({ ...rawLender, address: 'asdf' })),
    } as unknown as ActiveLender);
    await component.ionViewWillEnter();
    fixture.detectChanges();

    _confirmButton().click();
    await fixture.whenRenderingDone();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it("should show generic error modal when handleSubmit and user can't afford tx fee", async () => {
    const spy = spyOn(component, 'openBlockchainErrorModal').and.callThrough();
    walletTransactionsServiceSpy.canAffordSendTx.and.resolveTo(false);
    await component.ionViewWillEnter();
    fixture.detectChanges();

    _confirmButton().click();
    await fixture.whenRenderingDone();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should track event when executing request fund faucet', async () => {
    walletBalanceServiceSpy.balanceOf.and.returnValue(Promise.resolve(0.0));
    defiInvestmentServiceSpy.fundWallet.and.returnValue(of(true));
    await component.ionViewWillEnter();
    fixture.detectChanges();

    _confirmButton().click();
    await fixture.whenRenderingDone();

    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(2);
  });

  it('should save user dni in storage when ux_warranty_start_confirm is clicked and dni is valid', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();

    _confirmButton().click();
    await fixture.whenRenderingDone();

    expect(ionicStorageServiceSpy.set).toHaveBeenCalledOnceWith('user_dni', 1234567);
  });
});
