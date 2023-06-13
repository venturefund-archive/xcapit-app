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
import { rawMATICData, rawUSDCData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
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
  let defiInvesmentServiceSpy: jasmine.SpyObj<DefiInvestmentsService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;

  const aPassword = new Password('aPassword');
  const summaryData: SummaryWarrantyData = {
    amount: 10,
    coin: rawUSDCData,
    user_dni: 1234567,
    quoteAmount: 10,
    quoteAmountWithoutCost: 9.8,
    service_cost: 0.2,
    amountWithoutCost: 9.8,
  };
  const transactionData: SummaryWarrantyData = {
    wallet: '0x00001',
    currency: 'USDC',
    amount: 9.8,
    service_cost: 0.2,
    transaction_hash: 'someHash',
    user_dni: 1234567,
  };
  beforeEach(waitForAsync(() => {
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

    defiInvesmentServiceSpy = jasmine.createSpyObj('DefiInvesmentService', {
      fundWallet: of(),
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getNativeTokenFromNetwork: rawMATICData,
    });

    walletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', { balanceOf: Promise.resolve('51') });

    warrantyDataServiceSpy = jasmine.createSpyObj('WarrantyDataService', {}, { data: summaryData });

    warrantyServiceSpy = jasmine.createSpyObj('WarrantyService', { createWarranty: of({ transactionData }) });

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve('0x00001'),
    });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
    });

    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', { getFeatureFlag: true });

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
        { provide: DefiInvestmentsService, useValue: defiInvesmentServiceSpy },
        { provide: WalletBalanceService, useValue: walletBalanceServiceSpy },
        { provide: RemoteConfigService, useValue: remoteConfigSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WarrantySummaryPage);
    component = fixture.componentInstance;
    component.warrantyAddress = '0xdd3c288e12f2bc0207b15e609519832378f588d5';
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

  it('should send and show success modal when user can afford fees and password is correct on ux_warranty_start_confirm button clicked', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledOnceWith(
      aPassword.value(),
      10,
      component.warrantyAddress,
      summaryData.coin
    );
  });

  it('should disabled loading when ux_warranty_start_confirm button is clicked and password undefined', async () => {
    fakeModalController.modifyReturns(null, { data: undefined });
    await component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();

    expect(component.loading).toBeFalsy();
  });

  it('should not fund wallet if ff_fundFaucetOnWarranties is false', async () => {
    remoteConfigSpy.getFeatureFlag.and.returnValue(false);
    await component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();

    expect(defiInvesmentServiceSpy.fundWallet).toHaveBeenCalledTimes(0);
  });

  it('should fund wallet and create warranty when ux_warranty_start_confirm button is clicked and password is correct', async () => {
    walletTransactionsServiceSpy.canAffordSendFee.and.resolveTo(false);
    await component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();

    expect(defiInvesmentServiceSpy.fundWallet).toHaveBeenCalledTimes(1);
    expect(warrantyServiceSpy.createWarranty).toHaveBeenCalledOnceWith(transactionData);
  });

  it('should show generic error modal when handleSubmit and a non-blockchain error happens', async () => {
    walletTransactionsServiceSpy.send.and.throwError('Test');
    const spy = spyOn(component, 'openErrorModal').and.callThrough();
    await component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();

    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledOnceWith(
      aPassword.value(),
      10,
      component.warrantyAddress,
      summaryData.coin
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show generic error modal when handleSubmit and address is invalid', async () => {
    const spy = spyOn(component, 'openErrorModal').and.callThrough();
    component.ionViewWillEnter();
    fixture.detectChanges();
    component.warrantyAddress = '';
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it("should show generic error modal when handleSubmit and user can't afford tx fee", async () => {
    const spy = spyOn(component, 'openBlockchainErrorModal').and.callThrough();
    walletTransactionsServiceSpy.canAffordSendTx.and.resolveTo(false);
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should track event when executing request fund faucet', async () => {
    walletBalanceServiceSpy.balanceOf.and.returnValue(Promise.resolve(0.0));
    defiInvesmentServiceSpy.fundWallet.and.returnValue(of(true));
    await component.ionViewWillEnter();

    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(2);
  });

  it('should save user dni in storage when ux_warranty_start_confirm is clicked and dni is valid', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_start_confirm"]')).nativeElement.click();
    await fixture.whenRenderingDone();
    await fixture.whenStable();

    expect(ionicStorageServiceSpy.set).toHaveBeenCalledOnceWith('user_dni', 1234567);
  });
});
