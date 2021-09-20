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
import { TrackClickDirective } from '../../../../shared/directives/track-click/track-click.directive';
import { By } from '@angular/platform-browser';
import { navControllerMock } from '../../../../../testing/spies/nav-controller-mock.spec';
import { WalletTransactionsService } from '../../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

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
  let navController: NavController;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', null, { queryParams: of({}) });
    routerSpy = jasmine.createSpyObj('Router', {
      getCurrentNavigation: {
        extras: {
          state: undefined,
        },
      },
    });
    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showToast: Promise.resolve(),
    });
    transactionDataServiceMock = {
      transactionData: summaryData,
    };
    walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionService', {
      send: () => Promise.resolve(),
    });

    fakeModalController = new FakeModalController(Promise.resolve(), Promise.resolve({ data: '' }));
    modalControllerSpy = fakeModalController.createSpy();

    TestBed.configureTestingModule({
      declarations: [SendSummaryPage, TrackClickDirective],
      imports: [IonicModule, TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      providers: [
        TrackClickDirective,
        { provide: TransactionDataService, useValue: transactionDataServiceMock },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerMock },
        { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SendSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    navController = TestBed.inject(NavController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data on will enter', () => {
    component.ionViewWillEnter();
    expect(component.summaryData).toEqual(summaryData);
  });

  it('should call trackEvent on trackService when Send Button clicked', () => {
    spyOn(component, 'send');
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
    fakeModalController.modifyReturns(Promise.resolve(), Promise.resolve({ data: 'testPassword' }));
    const spyNav = spyOn(navController, 'navigateForward').and.callThrough();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(walletTransactionsServiceSpy.send).toHaveBeenCalledOnceWith('testPassword', 1, 'asdlkfjasd56lfjasdpodlfkj', {
      id: 1,
      name: 'BTC - Bitcoin',
      logoRoute: '../../assets/img/coins/BTC.svg',
      last: false,
      value: 'BTC',
      network: '',
      rpc: '',
    });
    expect(spyNav).toHaveBeenCalledOnceWith(['/wallets/send/success']);
  });

  it('should not send transaction when Send Button clicked and password is wrong', async () => {
    walletTransactionsServiceSpy.send.and.throwError('invalid password');
    component.ngOnInit();
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(walletTransactionsServiceSpy.send).not.toHaveBeenCalled();
  });

  it('should navigate to invalid password page when modal is closed and password is incorrect', async () => {
    component.summaryData = summaryData;
    spyOn(component, 'askForPassword').and.returnValue(Promise.resolve('invalid'));
    const spyNav = spyOn(navController, 'navigateForward');
    walletTransactionsServiceSpy.send.and.throwError('invalid password');
    await component.send();
    await fixture.whenStable();
    expect(spyNav).toHaveBeenCalledWith('/wallets/send/error/incorrect-password');
  });

  it('should open modal if redirected from Incorrect Password Page', () => {
    routerSpy.getCurrentNavigation.and.returnValue({
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
    });
    component.ngOnInit();
    component.ionViewWillEnter();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
