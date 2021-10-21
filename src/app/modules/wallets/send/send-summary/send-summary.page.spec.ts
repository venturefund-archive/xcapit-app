import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AlertController, IonicModule, ModalController, NavController } from '@ionic/angular';
import { SendSummaryPage } from './send-summary.page';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { SummaryData } from './interfaces/summary-data.interface';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from '../../../../../testing/track-click-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { WalletTransactionsService } from '../../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { FakeTrackClickDirective } from '../../../../../testing/fakes/track-click-directive.fake.spec';
import { ActivatedRoute } from '@angular/router';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { LocalNotificationsService } from '../../../notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { LocalNotification } from '@capacitor/core';
import { FakeNavController } from '../../../../../testing/fakes/nav-controller.fake.spec';

const testLocalNotification: LocalNotification = {
  id: 1,
  title: 'wallets.send.send_summary.sent_notification.title',
  body: 'wallets.send.send_summary.sent_notification.body',
};

const summaryData: SummaryData = {
  network: 'ERC20',
  currency: {
    id: 1,
    name: 'BTC - Bitcoin',
    logoRoute: '../../assets/img/coins/BTC.svg',
    last: false,
    value: 'BTC',
    network: '',
    rpc: '',
  },
  address: 'asdlkfjasd56lfjasdpodlfkj',
  amount: 1,
  referenceAmount: 50000,
};

describe('SendSummaryPage', () => {
  let component: SendSummaryPage;
  let fixture: ComponentFixture<SendSummaryPage>;
  let transactionDataServiceMock: any;
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
    transactionDataServiceMock = {
      transactionData: summaryData,
    };
    walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionService', {
      send: Promise.resolve({ wait: () => Promise.resolve({ transactionHash: 'someHash' }) }),
      canNotAffordFee: Promise.resolve(false),
    });

    fakeModalController = new FakeModalController(null, { data: 'testPassword' });
    modalControllerSpy = fakeModalController.createSpy();

    loadingServiceSpy = jasmine.createSpyObj('LoadingService', {
      show: Promise.resolve(),
      dismiss: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [SendSummaryPage, FakeTrackClickDirective],
      imports: [IonicModule, TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: TransactionDataService, useValue: transactionDataServiceMock },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: LocalNotificationsService, useValue: localNotificationsServiceSpy },
        { provide: AlertController, useValue: alertControllerSpy },
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

  it('should get data on will enter', () => {
    component.ionViewWillEnter();
    expect(component.summaryData).toEqual(summaryData);
  });

  it('should call trackEvent on trackService when Send Button clicked', () => {
    spyOn(component, 'beginSend');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Send');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should send transaction and navigate on Send Button clicked and can afford fees and password is correct', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledOnceWith(
      'testPassword',
      1,
      'asdlkfjasd56lfjasdpodlfkj',
      summaryData.currency
    );
    expect(localNotificationsServiceSpy.send).toHaveBeenCalledOnceWith([testLocalNotification]);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/send/success']);
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(2);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(2);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should navigate to invalid password page when modal is closed and password is incorrect', async () => {
    component.summaryData = summaryData;
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'invalid' }));
    walletTransactionsServiceSpy.send.and.rejectWith({ message: 'invalid password' });
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledOnceWith(
      'invalid',
      1,
      'asdlkfjasd56lfjasdpodlfkj',
      summaryData.currency
    );
    expect(localNotificationsServiceSpy.send).not.toHaveBeenCalled();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/wallets/send/error/incorrect-password');
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(2);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(2);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should open modal if redirected from Incorrect Password Page', async () => {
    paramMapSpy.get.and.returnValue('retry');
    await component.ionViewWillEnter();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should show loader at the start of transaction and dismiss it afterwards', fakeAsync(() => {
    component.summaryData = summaryData;
    component.beginSend();
    tick(50);
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
  }));

  it('should dismiss loader if password incorrect', fakeAsync(() => {
    component.summaryData = summaryData;
    walletTransactionsServiceSpy.send.and.callFake(() => Promise.reject(new Error('invalid password')));
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'invalid' }));
    component.beginSend();
    tick(500);
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
  }));

  it('should redirect to Wrong Amount Page if amount is bigger than the amount in wallet', async () => {
    component.summaryData = summaryData;
    walletTransactionsServiceSpy.send.and.callFake(() =>
      Promise.reject(new Error('insufficient funds for intrinsic transaction cost ...'))
    );
    component.ionViewWillEnter();
    fixture.detectChanges();
    navControllerSpy.navigateForward.and.callThrough();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/wallets/send/error/wrong-amount');
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should redirect to Wrong Address Page if could not resolve ENS', async () => {
    component.summaryData = summaryData;
    walletTransactionsServiceSpy.send.and.callFake(() =>
      Promise.reject(new Error('provided ENS name resolves to null ...'))
    );
    component.ionViewWillEnter();
    fixture.detectChanges();
    navControllerSpy.navigateForward.and.callThrough();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/wallets/send/error/wrong-address');
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should redirect to Wrong Address Page if address is invalid', async () => {
    component.summaryData = summaryData;
    walletTransactionsServiceSpy.send.and.callFake(() => Promise.reject(new Error('invalid address ...')));
    component.ionViewWillEnter();
    fixture.detectChanges();
    navControllerSpy.navigateForward.and.callThrough();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/wallets/send/error/wrong-address');
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should redirect to Wrong Address Page if address did not pass checksum', async () => {
    component.summaryData = summaryData;
    walletTransactionsServiceSpy.send.and.callFake(() => Promise.reject(new Error('bad address checksum ...')));
    component.ionViewWillEnter();
    fixture.detectChanges();
    navControllerSpy.navigateForward.and.callThrough();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/wallets/send/error/wrong-address');
    expect(alertSpy.present).toHaveBeenCalledTimes(0);
  });

  it('should show alert if address is incorrect', async () => {
    component.summaryData = summaryData;
    walletTransactionsServiceSpy.canNotAffordFee.and.callFake(() =>
      Promise.reject(new Error('bad address checksum ...'))
    );
    component.ionViewWillEnter();
    fixture.detectChanges();
    navControllerSpy.navigateForward.and.callThrough();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(alertSpy.present).toHaveBeenCalledTimes(1);
  });

  it('should open alert and not send transaction nor redirect user if user cannot afford fees', async () => {
    walletTransactionsServiceSpy.canNotAffordFee.and.returnValue(Promise.resolve(true));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledTimes(0);
    expect(localNotificationsServiceSpy.send).toHaveBeenCalledTimes(0);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(alertSpy.present).toHaveBeenCalledTimes(1);
  });

  it('should show loader when user clicks on send and close it before asking for password', async () => {
    const spy = spyOn(component, 'beginSend');
    walletTransactionsServiceSpy.canNotAffordFee.and.returnValue(Promise.resolve(false));
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show loader when user clicks on send and close it before showing alert', async () => {
    const spy = spyOn(component, 'showAlertNotEnoughNativeToken');
    walletTransactionsServiceSpy.canNotAffordFee.and.returnValue(Promise.resolve(true));
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
