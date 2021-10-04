import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
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
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { LocalNotificationsService } from '../../../notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { LocalNotification } from '@capacitor/core';
import { FakeNavController } from '../../../../../testing/fakes/nav-controller.fake.spec';

const testExtras = {
  id: 1,
  initialUrl: null,
  extractedUrl: null,
  trigger: null,
  previousNavigation: null,
  extras: {
    state: {
      action: 'retry',
    },
  },
};

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
  let routerSpy: jasmine.SpyObj<Router>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let localNotificationsServiceSpy: jasmine.SpyObj<LocalNotificationsService>;

  beforeEach(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    localNotificationsServiceSpy = jasmine.createSpyObj('LocalNotificationsService', {
      send: Promise.resolve(),
    });
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', null, { queryParams: of({}) });
    routerSpy = jasmine.createSpyObj('Router', {
      getCurrentNavigation: {
        extras: {
          state: undefined,
        },
      },
    });
    transactionDataServiceMock = {
      transactionData: summaryData,
    };
    walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionService', {
      send: Promise.resolve({ wait: () => Promise.resolve({ transactionHash: 'someHash' }) }),
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
        { provide: Router, useValue: routerSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: LocalNotificationsService, useValue: localNotificationsServiceSpy },
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

  it('should send transaction and navigate on Send Button clicked and password is correct', async () => {
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
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
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
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should open modal if redirected from Incorrect Password Page', () => {
    routerSpy.getCurrentNavigation.and.returnValue(testExtras);
    component.ngOnInit();
    component.ionViewWillEnter();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
