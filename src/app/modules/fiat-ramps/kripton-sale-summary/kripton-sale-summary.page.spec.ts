import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { KriptonSaleSummaryPage } from './kripton-sale-summary.page';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { WalletTransactionsService } from '../../wallets/shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { TxInProgressService } from '../../swaps/shared-swaps/services/tx-in-progress/tx-in-progress.service';
import { of } from 'rxjs';
import { rawBlockchainsData } from '../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { BlockchainRepo } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { DefaultBlockchains } from '../../swaps/shared-swaps/models/blockchains/default/default-blockchains';
import { rawTokensData, rawUSDCData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { By } from '@angular/platform-browser';
import { Password } from '../../swaps/shared-swaps/models/password/password';
import { BankAccount } from '../shared-ramps/types/bank-account.type';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { rawCashOutOperationData } from '../shared-ramps/fixtures/raw-operation-data';
import { FakeModal } from 'src/app/shared/models/modal/fake/fake-modal';
import { ModalFactoryInjectable } from 'src/app/shared/models/modal/injectable/modal-factory.injectable';
import { FakeModalFactory } from 'src/app/shared/models/modal/factory/fake/fake-modal-factory';

describe('KriptonSaleSummaryPage', () => {
  let component: KriptonSaleSummaryPage;
  let fixture: ComponentFixture<KriptonSaleSummaryPage>;
  let storageOperationServiceSpy: jasmine.SpyObj<StorageOperationService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let kriptonStorageSpy: jasmine.SpyObj<KriptonStorageService>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let txInProgressServiceSpy: jasmine.SpyObj<TxInProgressService>;
  let envServiceSpy: jasmine.SpyObj<EnvService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let modalFactoryInjectableSpy: jasmine.SpyObj<ModalFactoryInjectable>;
  let fakeModal: FakeModal;

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
    storageOperationServiceSpy = jasmine.createSpyObj('StorageOperationService', {
      getData: rawCashOutOperationData,
    });

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getUserBank: of(userBankData),
      confirmCashOutOperation: of(),
    });

    kriptonStorageSpy = jasmine.createSpyObj('KriptonStorageService', {
      get: Promise.resolve(),
    });
    kriptonStorageSpy.get.withArgs('email').and.resolveTo('test@test.com');
    kriptonStorageSpy.get.withArgs('access_token').and.resolveTo('test');

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    loadingServiceSpy = jasmine.createSpyObj('LoadingService', {
      show: Promise.resolve(),
      dismiss: Promise.resolve(),
    });

    walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionsService', {
      send: Promise.resolve({ wait: () => Promise.resolve({ transactionHash: 'someHash' }) }),
      canAffordSendFee: Promise.resolve(true),
      canAffordSendTx: Promise.resolve(true),
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: rawTokensData,
    });

    fakeModalController = new FakeModalController(null, { data: new Password('aPassword') });
    modalControllerSpy = fakeModalController.createSpy();

    txInProgressServiceSpy = jasmine.createSpyObj('TxInProgressService', {
      startTx: Promise.resolve(),
      finishTx: Promise.resolve(),
    });

    envServiceSpy = jasmine.createSpyObj('EnvService', {
      byKey: { MATIC: '0xaWallet' },
    });

    fakeModal = new FakeModal();

    modalFactoryInjectableSpy = jasmine.createSpyObj('ModalFactoryInjectable', {
      create: new FakeModalFactory(fakeModal),
    });

    TestBed.configureTestingModule({
      declarations: [KriptonSaleSummaryPage, FormattedAmountPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: StorageOperationService, useValue: storageOperationServiceSpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: KriptonStorageService, useValue: kriptonStorageSpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: TxInProgressService, useValue: txInProgressServiceSpy },
        { provide: EnvService, useValue: envServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: ModalFactoryInjectable, useValue: modalFactoryInjectableSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KriptonSaleSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all required data', async () => {
    await component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(storageOperationServiceSpy.getData).toHaveBeenCalledTimes(1);
    expect(blockchainsFactorySpy.create).toHaveBeenCalledTimes(1);
    expect(apiWalletServiceSpy.getCoins).toHaveBeenCalledTimes(1);
    expect(fiatRampsServiceSpy.getUserBank).toHaveBeenCalledOnceWith({
      email: 'test@test.com',
      auth_token: 'test',
      payment_method_id: rawCashOutOperationData.payment_method_id,
    });
  });

  it('should render properly app-coin-content-item', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();

    const coinItemComponentEl = fixture.debugElement.query(By.css('app-coin-content-item'));

    expect(coinItemComponentEl).toBeTruthy();
  });

  it('should send, confirm operation and show success toast', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_sell_send_confirm"]')).nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
    expect(txInProgressServiceSpy.startTx).toHaveBeenCalledTimes(1);
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledOnceWith(
      'aPassword',
      rawCashOutOperationData.amount_in,
      rawCashOutOperationData.kripton_wallet,
      rawUSDCData
    );
    expect(txInProgressServiceSpy.finishTx).toHaveBeenCalledTimes(1);
    expect(fiatRampsServiceSpy.confirmCashOutOperation).toHaveBeenCalledOnceWith(rawCashOutOperationData.operation_id, {
      email: 'test@test.com',
      auth_token: 'test',
      tx_hash: 'someHash',
    });
  });

  it('should not send if user can not afford fee', async () => {
    walletTransactionsServiceSpy.canAffordSendFee.and.resolveTo(false);

    await component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_sell_send_confirm"]')).nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(0);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(fakeModal.calls).toEqual(1);
  });

  it('should not send if user can not afford transaction', async () => {
    walletTransactionsServiceSpy.canAffordSendTx.and.resolveTo(false);

    await component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_sell_send_confirm"]')).nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(0);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(fakeModal.calls).toEqual(1);
  });

  it('should not send if user close password modal', async () => {
    fakeModalController.modifyReturns(null, { data: undefined });
    await component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_sell_send_confirm"]')).nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(0);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(2);
  });

  it('should throw error and show error modal if send fails', async () => {
    walletTransactionsServiceSpy.send.and.throwError('');

    await component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_sell_send_confirm"]')).nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(1);
    expect(fiatRampsServiceSpy.confirmCashOutOperation).toHaveBeenCalledTimes(0);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(2);
  });
});
