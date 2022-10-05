import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AlertController, IonicModule, ModalController, NavController } from '@ionic/angular';
import { SendSummaryPage } from './send-summary.page';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { SummaryData } from './interfaces/summary-data.interface';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from '../../../../../testing/track-click-directive-test.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { WalletTransactionsService } from '../../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { FakeTrackClickDirective } from '../../../../../testing/fakes/track-click-directive.fake.spec';
import { ActivatedRoute } from '@angular/router';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { LocalNotificationsService } from '../../../notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { LocalNotificationSchema } from '@capacitor/local-notifications';
import { FakeNavController } from '../../../../../testing/fakes/nav-controller.fake.spec';
import { BigNumber, constants } from 'ethers';
import { PasswordErrorMsgs } from 'src/app/modules/swaps/shared-swaps/models/password/password-error-msgs';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { WalletsFactory } from 'src/app/modules/swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { FakeWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import {
  rawBlockchainsData,
  rawSolanaData,
} from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { SpyProperty } from '../../../../../testing/spy-property.spec';
import { rawETHData, rawSOLData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';

fdescribe('SendSummaryPage', () => {
  let component: SendSummaryPage;
  let fixture: ComponentFixture<SendSummaryPage>;
  let transactionDataServiceSpy: jasmine.SpyObj<TransactionDataService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SendSummaryPage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let paramMapSpy: jasmine.SpyObj<any>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let localNotificationsServiceSpy: jasmine.SpyObj<LocalNotificationsService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let alertSpy: jasmine.SpyObj<HTMLIonAlertElement>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let walletsFactorySpy: jasmine.SpyObj<WalletsFactory>;
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));
  const testLocalNotification: LocalNotificationSchema = {
    id: 1,
    title: 'wallets.send.send_summary.sent_notification.title',
    body: 'wallets.send.send_summary.sent_notification.body',
  };

  const summaryData: SummaryData = {
    network: 'ERC20',
    currency: rawETHData,
    address: constants.AddressZero,
    amount: 1,
    referenceAmount: '50000',
    balance: 2,
  };

  beforeEach(() => {
    alertSpy = jasmine.createSpyObj('Alert', { present: Promise.resolve() });
    alertControllerSpy = jasmine.createSpyObj('AlertController', { create: Promise.resolve(alertSpy) });
    paramMapSpy = jasmine.createSpyObj('QueryParams', { get: undefined });
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', null, { snapshot: { paramMap: paramMapSpy } });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    localNotificationsServiceSpy = jasmine.createSpyObj('LocalNotificationsService', {
      send: Promise.resolve(),
    });
    transactionDataServiceSpy = jasmine.createSpyObj('TransactionDataService', {}, { transactionData: summaryData });
    walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionService', {
      send: Promise.resolve({ wait: () => Promise.resolve({ transactionHash: 'someHash' }) }),
      canAffordSendFee: Promise.resolve(true),
      canAffordSendTx: Promise.resolve(true),
      estimateSendFee: Promise.resolve(BigNumber.from('1000')),
    });
    fakeModalController = new FakeModalController(null, { data: 'testPassword' });
    modalControllerSpy = fakeModalController.createSpy();
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', {
      show: Promise.resolve(),
      dismiss: Promise.resolve(),
    });

    trackServiceSpy = jasmine.createSpyObj('TrackService', {
      trackEvent: Promise.resolve(),
    });

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    walletsFactorySpy = jasmine.createSpyObj('WalletsFactory', {
      create: { oneBy: () => Promise.resolve(new FakeWallet()) },
    });

    TestBed.configureTestingModule({
      declarations: [SendSummaryPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: TransactionDataService, useValue: transactionDataServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: LocalNotificationsService, useValue: localNotificationsServiceSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: WalletsFactory, useValue: walletsFactorySpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SendSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(component.summaryData).toEqual(summaryData);
  });

  it('should open modal if redirected from Incorrect Password Page', fakeAsync(() => {
    paramMapSpy.get.and.returnValue('retry');
    component.ionViewWillEnter();
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  }));

  it('should call trackEvent on trackService when ux_send_send Button clicked', () => {
    spyOn(component, 'handleSubmit');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_send_send');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should send and navigate to success when user can afford fees and password is correct on ux_send_send Button clicked', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_send_send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledOnceWith(
      'testPassword',
      1,
      constants.AddressZero,
      summaryData.currency
    );
    expect(component.isSending).toBeFalse();
    expect(localNotificationsServiceSpy.send).toHaveBeenCalledOnceWith([testLocalNotification]);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/send/success']);
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(2);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should send if solana', async () => {
    const solanaSummaryData = { ...summaryData, currency: rawSOLData, network: rawSolanaData.name };
    new SpyProperty(transactionDataServiceSpy, 'transactionData').value().and.returnValue(solanaSummaryData);
    component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_send_send"]')).nativeElement.click();
    await fixture.whenStable();

    expect(component.isSending).toBeFalse();
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(2);
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
    expect(localNotificationsServiceSpy.send).toHaveBeenCalledOnceWith([testLocalNotification]);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/send/success']);
  });

  it('should navigate to invalid password page when modal is closed and password is incorrect', async () => {
    component.summaryData = summaryData;
    component.ionViewWillEnter();
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'invalid' }));
    walletTransactionsServiceSpy.send.and.rejectWith({ message: new PasswordErrorMsgs().invalid() });
    fixture.debugElement.query(By.css('ion-button[name="ux_send_send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledOnceWith(
      'invalid',
      1,
      constants.AddressZero,
      summaryData.currency
    );
    expect(component.isSending).toBeFalse();
    expect(localNotificationsServiceSpy.send).not.toHaveBeenCalled();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/send/error/incorrect-password']);
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(2);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should cancel transaction if user closed modal', async () => {
    component.summaryData = summaryData;
    component.ionViewWillEnter();
    fakeModalController.modifyReturns(null, Promise.resolve({}));
    fixture.debugElement.query(By.css('ion-button[name="ux_send_send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(walletTransactionsServiceSpy.send).not.toHaveBeenCalled();
    expect(component.isSending).toBeFalse();
    expect(localNotificationsServiceSpy.send).not.toHaveBeenCalled();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(2);
  });

  it('should show loader at the start of transaction and dismiss it afterwards', fakeAsync(() => {
    component.summaryData = summaryData;
    component.ionViewWillEnter();
    component.handleSubmit();
    tick(50);
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(2);
  }));

  it('should redirect to Wrong Amount Page if not enough funds for transaction estimated cost', async () => {
    walletTransactionsServiceSpy.canAffordSendTx.and.resolveTo(false);
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_send_send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.isSending).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/send/error/wrong-amount']);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should redirect to Wrong Amount Page if not enough funds for transaction estimated cost', async () => {
    walletTransactionsServiceSpy.send.and.rejectWith(new Error('insufficient funds'));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_send_send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.isSending).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/send/error/wrong-amount']);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should redirect to Wrong Amount Page if not enough funds for transaction cost', async () => {
    walletTransactionsServiceSpy.send.and.rejectWith(new Error('insufficient funds'));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_send_send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.isSending).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/send/error/wrong-amount']);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should open alert and not send transaction nor redirect user if user cannot afford fees', async () => {
    walletTransactionsServiceSpy.canAffordSendFee.and.resolveTo(false);
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_send_send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(0);
    expect(localNotificationsServiceSpy.send).toHaveBeenCalledTimes(0);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(alertSpy.present).toHaveBeenCalledTimes(1);
  });

  it('should open modal when phraseAmountInfoClicked event is emited and isInfoModalOpen is false', () => {
    component.summaryData = summaryData;
    component.amountSend = true;
    component.isInfoModalOpen = false;
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('app-transaction-summary-card'))
      .triggerEventHandler('phraseAmountInfoClicked', null);
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
  it('should not open modal when phraseAmountInfoClicked event is emited and isInfoModalOpen is true ', () => {
    component.summaryData = summaryData;
    component.amountSend = true;
    component.isInfoModalOpen = true;
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('app-transaction-summary-card'))
      .triggerEventHandler('phraseAmountInfoClicked', null);
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });

  it('should open modal when phrasetransactionFeeInfoClicked event is emited and isInfoModalOpen is false', () => {
    component.summaryData = summaryData;
    component.transactionFee = true;
    component.isInfoModalOpen = false;
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('app-transaction-summary-card'))
      .triggerEventHandler('phrasetransactionFeeInfoClicked', null);
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not open modal when phrasetransactionFeeInfoClicked event is emited and isInfoModalOpen is true ', () => {
    component.summaryData = summaryData;
    component.transactionFee = true;
    component.isInfoModalOpen = true;
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('app-transaction-summary-card'))
      .triggerEventHandler('phrasetransactionFeeInfoClicked', null);
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });
});
