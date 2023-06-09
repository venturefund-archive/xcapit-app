import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController, Platform } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BitrefillPage } from './bitrefill.page';
import { LanguageService } from '../../../shared/services/language/language.service';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';
import { rawETHData, rawTokensData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WalletTransactionsService } from '../../wallets/shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { BigNumber } from 'ethers/lib/ethers';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { PasswordErrorMsgs } from '../../swaps/shared-swaps/models/password/password-error-msgs';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { BlockchainRepo } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { DefaultBlockchains } from '../../swaps/shared-swaps/models/blockchains/blockchains';
import { rawBlockchainsData, rawEthereumData } from '../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import {
  nativeEventInvoice,
  nativeEventPayment,
  nativeNonValidEventPayment,
  nonNativeEventInvoice,
  rawNativeEvent,
  rawNativeEventInvoice,
  rawNativeNonValidTokenEvent,
  rawNonNativeEvent,
  rawNonNativeEventInvoice,
} from '../shared-ramps/fixtures/raw-bitrefill-operation-data';
import { DefaultBitrefillOperation } from '../shared-ramps/models/bitrefill-operation/default-bitrefill-operation';
import { DefaultTokens } from '../../swaps/shared-swaps/models/tokens/tokens';
import { TokenRepo } from '../../swaps/shared-swaps/models/token-repo/token-repo';
import { BitrefillOperationFactory } from '../shared-ramps/models/bitrefill-operation/factory/bitrefill-operation.factory';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { ActivatedRoute } from '@angular/router';
import { CovalentBalancesInjectable } from '../../wallets/shared-wallets/models/balances/covalent-balances/covalent-balances.injectable';
import { TokenPricesInjectable } from '../../wallets/shared-wallets/models/prices/token-prices/token-prices.injectable';
import { FakePrices } from '../../wallets/shared-wallets/models/prices/fake-prices/fake-prices';
import { FakeBalances } from '../../wallets/shared-wallets/models/balances/fake-balances/fake-balances';
import { TokenDetailInjectable } from '../../wallets/shared-wallets/models/token-detail/injectable/token-detail.injectable';
import { TokenDetail } from '../../wallets/shared-wallets/models/token-detail/token-detail';
import { WalletsFactory } from '../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { FakeWallet } from '../../swaps/shared-swaps/models/wallet/fake/fake-wallet';
import { SpyProperty } from 'src/testing/spy-property.spec';
import { BuyOrDepositTokenToastComponent } from '../shared-ramps/components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { DefaultToken } from '../../swaps/shared-swaps/models/token/token';
import { EnvService } from 'src/app/shared/services/env/env.service';
import BalanceModalInjectable from 'src/app/shared/models/balance-modal/injectable/balance-modal.injectable';
import { FakeBalanceModal } from 'src/app/shared/models/balance-modal/fake/fake-balance-modal';

fdescribe('BitrefillPage', () => {
  let component: BitrefillPage;
  let fixture: ComponentFixture<BitrefillPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let transactionResponseSpy: jasmine.SpyObj<any>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let bitrefillOperationFactorySpy: jasmine.SpyObj<BitrefillOperationFactory>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let platformSpy: jasmine.SpyObj<Platform>;
  let covalentBalancesInjectableSpy: jasmine.SpyObj<CovalentBalancesInjectable>;
  let tokenPricesInjectableSpy: jasmine.SpyObj<TokenPricesInjectable>;
  let tokenDetailInjectableSpy: jasmine.SpyObj<TokenDetailInjectable>;
  let tokenDetailSpy: jasmine.SpyObj<TokenDetail>;
  let walletsFactorySpy: jasmine.SpyObj<WalletsFactory>;
  let envServiceSpy: jasmine.SpyObj<EnvService>;
  let balanceModalInjectableSpy: jasmine.SpyObj<BalanceModalInjectable>;
  let fakeBalanceModal: FakeBalanceModal;
  
  const aHashedPassword = 'iRJ1cT5x4V2jlpnVB0gp3bXdN4Uts3EAz4njSxGUNNqOGdxdWpjiTTWLOIAUp+6ketRUhjoRZBS8bpW5QnTnRA==';
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));
  const tokens = new DefaultTokens(new TokenRepo(rawTokensData));
  const token = new DefaultToken(rawETHData);
  const nativeToken = new DefaultToken({ ...rawEthereumData.nativeToken, network: 'ERC20' });
  const nativeOperation = new DefaultBitrefillOperation(rawNativeEvent, tokens);
  const nativeNonValidOperation = new DefaultBitrefillOperation(rawNativeNonValidTokenEvent, tokens);
  const nonNativeOperation = new DefaultBitrefillOperation(rawNonNativeEvent, tokens);
  const route = { paymentMethod: 'usdc_polygon' };

  const insufficientBalance = {
    token: token,
    text: 'swaps.home.balance_modal.insufficient_balance.text',
    primaryButtonText: 'swaps.home.balance_modal.insufficient_balance.firstButtonName',
    secondaryButtonText: 'swaps.home.balance_modal.insufficient_balance.secondaryButtonName',
  };

  const insufficientFee = {
    token: nativeToken,
    text: 'swaps.home.balance_modal.insufficient_balance_fee.text',
    primaryButtonText: 'swaps.home.balance_modal.insufficient_balance_fee.firstButtonName',
    secondaryButtonText: 'swaps.home.balance_modal.insufficient_balance_fee.secondaryButtonName',
  };

  const modalOptions = {
    component: BuyOrDepositTokenToastComponent,
    cssClass: 'ux-toast-warning',
    showBackdrop: false,
    id: 'feeModal',
    componentProps: {},
  };
  const _dispatchEvent = (data: string) => {
    const event = new MessageEvent('message', {
      data,
    });
    window.dispatchEvent(event);
  };

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController(null, { role: 'confirm' });
    modalControllerSpy = fakeModalController.createSpy();
    navControllerSpy = new FakeNavController().createSpy();

    fakeActivatedRoute = new FakeActivatedRoute({});
    activatedRouteSpy = fakeActivatedRoute.createSpy();

    languageServiceSpy = jasmine.createSpyObj('LanguageService', {
      getSelectedLanguage: Promise.resolve('pt'),
    });
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: rawTokensData,
    });

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    bitrefillOperationFactorySpy = jasmine.createSpyObj('BitrefillOperationFactory', {
      create: nativeOperation,
    });

    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showSuccessToast: Promise.resolve(),
      showErrorToast: Promise.resolve(),
    });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(true),
    });
    transactionResponseSpy = jasmine.createSpyObj('TransactionResponse', {
      wait: Promise.resolve({ transactionHash: 'someHash' }),
    });

    walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionService', {
      send: Promise.resolve(transactionResponseSpy),
      canAffordSendFee: Promise.resolve(true),
      canAffordSendTx: Promise.resolve(true),
      estimateSendFee: Promise.resolve(BigNumber.from('1000')),
    });
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', { trackEvent: Promise.resolve(true) });

    platformSpy = jasmine.createSpyObj('Platform', {}, { backButton: { subscribeWithPriority: () => {} } });

    tokenPricesInjectableSpy = jasmine.createSpyObj('TokenPricesInjectable', {
      create: new FakePrices(),
    });

    covalentBalancesInjectableSpy = jasmine.createSpyObj('CovalentBalancesInjectable', {
      create: new FakeBalances({ balance: 20 }),
    });

    tokenDetailSpy = jasmine.createSpyObj(
      'TokenDetail',
      {
        fetch: Promise.resolve(),
        cached: Promise.resolve(),
      },
      {
        price: 3000,
        balance: 20,
        quoteSymbol: 'USD',
      }
    );

    tokenDetailInjectableSpy = jasmine.createSpyObj('TokenDetailInjectable', { create: tokenDetailSpy });

    walletsFactorySpy = jasmine.createSpyObj('WalletsFactory', {
      create: { oneBy: () => Promise.resolve(new FakeWallet()) },
    });

    envServiceSpy = jasmine.createSpyObj('EnvService', {
      byKey: 'testAffiliateCode',
    });

    fakeBalanceModal = new FakeBalanceModal();

    balanceModalInjectableSpy = jasmine.createSpyObj('BalanceModalInjectable', {
      create: fakeBalanceModal,
    });

    TestBed.configureTestingModule({
      declarations: [BitrefillPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: BitrefillOperationFactory, useValue: bitrefillOperationFactorySpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: CovalentBalancesInjectable, useValue: covalentBalancesInjectableSpy },
        { provide: TokenPricesInjectable, useValue: tokenPricesInjectableSpy },
        { provide: TokenDetailInjectable, useValue: tokenDetailInjectableSpy },
        { provide: WalletsFactory, useValue: walletsFactorySpy },
        { provide: EnvService, useValue: envServiceSpy },
        { provide: BalanceModalInjectable, useValue: balanceModalInjectableSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BitrefillPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render iframe with the proper url', async () => {
    fakeActivatedRoute.modifySnapshotParams(route);
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const iframeEl = fixture.debugElement.query(By.css('iframe'));
    expect(iframeEl.attributes.src).toEqual(
      `https://www.bitrefill.com/embed/?paymentMethod=${route.paymentMethod}&hl=pt&ref=testAffiliateCode&utm_source=xcapit`
    );
    component.ionViewWillLeave();
  });

  it('should render modal when exit button is clicked and should navigate to home wallet when user confirms', async () => {
    const exitButtonEl = fixture.debugElement.query(By.css('ion-buttons > ion-button[name="goBack"]'));
    exitButtonEl.nativeElement.click();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/tabs/wallets');
  });

  it('should render modal when exit button is clicked and should navigate to home wallet when user cancels', async () => {
    fakeModalController.modifyReturns(null, { role: 'cancel' });
    fixture.detectChanges();
    const exitButtonEl = fixture.debugElement.query(By.css('ion-buttons > ion-button[name="goBack"]'));
    exitButtonEl.nativeElement.click();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(navControllerSpy.navigateBack).not.toHaveBeenCalled();
  });

  it('should format data from non native operation', fakeAsync(() => {
    bitrefillOperationFactorySpy.create.and.returnValue(nonNativeOperation);
    component.ionViewWillEnter();
    _dispatchEvent(nonNativeEventInvoice);
    tick();
    expect(bitrefillOperationFactorySpy.create).toHaveBeenCalledOnceWith(rawNonNativeEventInvoice, tokens);
    expect(component.operation).toBeInstanceOf(DefaultBitrefillOperation);
    component.ionViewWillLeave();
  }));

  it('should format data from native operation', fakeAsync(() => {
    component.ionViewWillEnter();
    _dispatchEvent(nativeEventInvoice);
    tick();
    expect(bitrefillOperationFactorySpy.create).toHaveBeenCalledOnceWith(rawNativeEventInvoice, tokens);
    expect(component.operation).toBeInstanceOf(DefaultBitrefillOperation);

    component.ionViewWillLeave();
  }));

  it('should show error toast and not send transaction nor redirect user if user cannot afford fees', fakeAsync(() => {
    walletTransactionsServiceSpy.canAffordSendFee.and.resolveTo(false);
    component.ionViewWillEnter();
    _dispatchEvent(nativeEventPayment);
    tick(50);
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(0);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);

    component.ionViewWillLeave();
  }));

  it('should send transaction if user can afford it', fakeAsync(() => {
    ionicStorageServiceSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve(aHashedPassword));
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'aPassword' }));
    component.ionViewWillEnter();
    _dispatchEvent(nativeEventInvoice);
    tick();
    _dispatchEvent(nativeEventPayment);
    tick();
    fixture.detectChanges();
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showSuccessToast).toHaveBeenCalledTimes(1);
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledOnceWith({ eventLabel: 'ux_bitrefill_success' });

    component.ionViewWillLeave();
  }));

  it('should show modal if user has not funds', fakeAsync(() => {
    new SpyProperty(tokenDetailSpy, 'balance').value().and.returnValue(0);
    tokenDetailInjectableSpy.create.and.returnValue(tokenDetailSpy);
    component.ionViewWillEnter();
    _dispatchEvent(nativeEventInvoice);
    tick();
    fixture.detectChanges();
    expect(fakeBalanceModal.calls).toEqual(1);
  }));
  
  it('should show modal if user has not fee', fakeAsync(() => {
    walletTransactionsServiceSpy.canAffordSendFee.and.resolveTo(false);
    component.ionViewWillEnter();
    _dispatchEvent(nativeEventInvoice);
    tick();
    fixture.detectChanges();
    expect(fakeBalanceModal.calls).toEqual(1);
  }));

  it('should not send transaction if transaction response fail', fakeAsync(() => {
    ionicStorageServiceSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve(aHashedPassword));
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'aPassword' }));
    transactionResponseSpy.wait.and.rejectWith();

    component.ionViewWillEnter();
    _dispatchEvent(nativeEventInvoice);
    tick();

    _dispatchEvent(nativeEventPayment);
    tick();
    fixture.detectChanges();

    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledOnceWith({ eventLabel: 'ux_bitrefill_fail' });

    component.ionViewWillLeave();
  }));

  it('should not send transaction if token is not valid to use', fakeAsync(() => {
    ionicStorageServiceSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve(aHashedPassword));
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'aPassword' }));
    bitrefillOperationFactorySpy.create.and.returnValue(nativeNonValidOperation);

    component.ionViewWillEnter();
    _dispatchEvent(nativeNonValidEventPayment);
    tick(50);
    fixture.detectChanges();

    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(0);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledOnceWith({ eventLabel: 'ux_bitrefill_fail' });

    component.ionViewWillLeave();
  }));

  it('should show error toast if wallet password is incorrect', fakeAsync(() => {
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'invalid' }));
    walletTransactionsServiceSpy.send.and.rejectWith({ message: new PasswordErrorMsgs().invalid() });

    component.ionViewWillEnter();
    _dispatchEvent(nativeEventPayment);
    tick(50);
    fixture.detectChanges();

    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledOnceWith({ eventLabel: 'ux_bitrefill_fail' });

    component.ionViewWillLeave();
  }));

  it('should unsuscribe from window events when ionViewWillLeave was called', () => {
    spyOn(window, 'removeAllListeners');

    component.ionViewWillLeave();
    expect(window.removeAllListeners).toHaveBeenCalledTimes(1);
  });

  it('should suscribe to backButton gesture on will enter', () => {
    const spy = spyOn(platformSpy.backButton, 'subscribeWithPriority');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
