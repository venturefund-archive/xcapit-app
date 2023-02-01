import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BitrefillPage } from './bitrefill.page';
import { LanguageService } from '../../../shared/services/language/language.service';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';
import { RawBitrefillOperation } from '../shared-ramps/interfaces/raw-bitrefill-operation.interface';
import { BitrefillOperation } from '../shared-ramps/interfaces/bitrefill-operation.interface';
import { rawETHData, rawTokensData, rawUSDCData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WalletTransactionsService } from '../../wallets/shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { BigNumber } from 'ethers/lib/ethers';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { PasswordErrorMsgs } from '../../swaps/shared-swaps/models/password/password-error-msgs';

describe('BitrefillPage', () => {
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
  const rawNonNativeEvent =
    '{"event":"payment_intent", "invoiceId": "123-456-789-012","paymentMethod": "usdc_polygon","paymentUri":"ethereum:0x2791bca1f2de4661ed88a30c99a7a9449aa84174@137/transfer?address=0xD148C6735e1777BE439519B32A1a6Ef9c8853944&uint256=5.8e5"}';

  const rawNativeEvent =
    '{"event":"payment_intent", "invoiceId": "123-456-789-012","paymentMethod": "ethereum","paymentUri":"ethereum:0xD148C6735e1777BE439519B32A1a6Ef9c8853944@1?value=2e17&gasPrice=18&label=Bitrefill%20cebbd003-912e-4232-95a2-7f4d5e4bc5a5"}';

  const rawNativeNonValidTokenEvent =
    '{"event":"payment_intent", "invoiceId": "123-456-789-012","paymentMethod": "bitcoin","paymentUri":"bitcoin:0xD148C6735e1777BE439519B32A1a6Ef9c8853944@1?value=2e17&gasPrice=18&label=Bitrefill%20cebbd003-912e-4232-95a2-7f4d5e4bc5a5"}';

  const fakeNonNativeOperationRawData: RawBitrefillOperation = {
    paymentUri:
      'ethereum:0x2791bca1f2de4661ed88a30c99a7a9449aa84174@137/transfer?address=0xD148C6735e1777BE439519B32A1a6Ef9c8853944&uint256=5.8e5',
    event: 'payment_intent',
    invoiceId: '123-456-789-012',
    paymentMethod: 'usdc_polygon',
  };

  const fakeNativeOperationRawData: RawBitrefillOperation = {
    paymentUri:
      'ethereum:0xD148C6735e1777BE439519B32A1a6Ef9c8853944@1?value=2e17&gasPrice=18&label=Bitrefill%20cebbd003-912e-4232-95a2-7f4d5e4bc5a5',
    event: 'payment_intent',
    invoiceId: '123-456-789-012',
    paymentMethod: 'ethereum',
  };

  const fakeNonNativeOperationData: BitrefillOperation = {
    address: '0xD148C6735e1777BE439519B32A1a6Ef9c8853944',
    token: rawUSDCData,
    amount: 0.58,
    weiAmount: 580000,
    paymentMethod: 'usdc_polygon',
  };
  const fakeNativeOperationData: BitrefillOperation = {
    address: '0xD148C6735e1777BE439519B32A1a6Ef9c8853944',
    token: rawETHData,
    amount: 0.2,
    weiAmount: 200000000000000000,
    paymentMethod: 'ethereum',
  };

  const aHashedPassword = 'iRJ1cT5x4V2jlpnVB0gp3bXdN4Uts3EAz4njSxGUNNqOGdxdWpjiTTWLOIAUp+6ketRUhjoRZBS8bpW5QnTnRA==';

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
    languageServiceSpy = jasmine.createSpyObj('LanguageService', {
      getSelectedLanguage: Promise.resolve('pt'),
    });
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: rawTokensData,
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
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const iframeEl = fixture.debugElement.query(By.css('iframe'));
    expect(iframeEl.attributes.src).toEqual('https://www.bitrefill.com/embed/?hl=pt');
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
    component.ionViewWillEnter();
    _dispatchEvent(rawNonNativeEvent);
    tick();
    expect(component.rawData).toEqual(fakeNonNativeOperationRawData);
    expect(component.data).toEqual(fakeNonNativeOperationData);

    component.ionViewWillLeave();
  }));

  it('should format data from native operation', fakeAsync(() => {
    component.ionViewWillEnter();
    _dispatchEvent(rawNativeEvent);
    tick();
    expect(component.rawData).toEqual(fakeNativeOperationRawData);
    expect(component.data).toEqual(fakeNativeOperationData);

    component.ionViewWillLeave();
  }));

  it('should show error toast and not send transaction nor redirect user if user cannot afford fees', fakeAsync(() => {
    walletTransactionsServiceSpy.canAffordSendFee.and.resolveTo(false);
    component.ionViewWillEnter();
    _dispatchEvent(rawNativeEvent);
    tick(50);
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(0);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);

    component.ionViewWillLeave();
  }));

  it('should send transaction if user can afford fees', fakeAsync(() => {
    ionicStorageServiceSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve(aHashedPassword));
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'aPassword' }));
    component.ionViewWillEnter();
    _dispatchEvent(rawNativeEvent);
    tick(50);
    fixture.detectChanges();
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showSuccessToast).toHaveBeenCalledTimes(1);
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledOnceWith({ eventLabel: 'ux_bitrefill_success' });

    component.ionViewWillLeave();
  }));

  it('should not send transaction if user has not funds', fakeAsync(() => {
    ionicStorageServiceSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve(aHashedPassword));
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'aPassword' }));
    walletTransactionsServiceSpy.send.and.rejectWith(new Error('insufficient funds'));

    component.ionViewWillEnter();
    _dispatchEvent(rawNativeEvent);
    tick(50);
    fixture.detectChanges();

    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledOnceWith({ eventLabel: 'ux_bitrefill_fail' });

    component.ionViewWillLeave();
  }));

  it('should not send transaction if transaction response fail', fakeAsync(() => {
    ionicStorageServiceSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve(aHashedPassword));
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'aPassword' }));
    transactionResponseSpy.wait.and.rejectWith();

    component.ionViewWillEnter();
    _dispatchEvent(rawNativeEvent);
    tick(50);
    fixture.detectChanges();

    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledOnceWith({ eventLabel: 'ux_bitrefill_fail' });

    component.ionViewWillLeave();
  }));

  it('should not send transaction if token is not valid to use', fakeAsync(() => {
    ionicStorageServiceSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve(aHashedPassword));
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'aPassword' }));

    component.ionViewWillEnter();
    _dispatchEvent(rawNativeNonValidTokenEvent);
    tick(50);
    fixture.detectChanges();

    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(0);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledOnceWith({ eventLabel: 'ux_bitrefill_fail' });

    component.ionViewWillLeave();
  }));

  it('should navigate to error page when modal is closed and password is incorrect', fakeAsync(() => {
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'invalid' }));
    walletTransactionsServiceSpy.send.and.rejectWith({ message: new PasswordErrorMsgs().invalid() });

    component.ionViewWillEnter();
    _dispatchEvent(rawNativeEvent);
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
});
