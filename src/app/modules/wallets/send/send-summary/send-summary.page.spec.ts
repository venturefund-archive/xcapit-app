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

fdescribe('SendSummaryPage', () => {
  let component: SendSummaryPage;
  let fixture: ComponentFixture<SendSummaryPage>;
  let transactionDataServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SendSummaryPage>;
  let modalControllerMock: any;
  let modalController: ModalController;
  let navController: NavController;
  let walletTransactionsServiceMock: any;
  let walletTransactionService: WalletTransactionsService;
  let onDidDismissSpy;
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
    walletTransactionsServiceMock = {
      send: () => Promise.resolve(),
    };
    onDidDismissSpy = jasmine
      .createSpy('onDidDismiss', () => Promise.resolve({ data: 'testPassword' }))
      .and.callThrough();
    modalControllerMock = {
      create: jasmine.createSpy('create', () =>
        Promise.resolve({
          present: () => Promise.resolve(),
          onDidDismiss: onDidDismissSpy,
          dismiss: () => Promise.resolve(),
        })
      ),
      dismiss: Promise.resolve(),
    };

    modalControllerMock.create.and.callThrough();
    TestBed.configureTestingModule({
      declarations: [SendSummaryPage, TrackClickDirective],
      imports: [IonicModule, TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      providers: [
        TrackClickDirective,
        { provide: TransactionDataService, useValue: transactionDataServiceMock },
        { provide: ModalController, useValue: modalControllerMock },
        { provide: NavController, useValue: navControllerMock },
        { provide: WalletTransactionsService, useValue: walletTransactionsServiceMock },
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
    modalController = TestBed.inject(ModalController);
    navController = TestBed.inject(NavController);
    walletTransactionService = TestBed.inject(WalletTransactionsService);
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
    const spyNav = spyOn(navController, 'navigateForward').and.callThrough();
    const spySend = spyOn(walletTransactionService, 'send').and.callThrough();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(spySend).toHaveBeenCalledOnceWith('testPassword', 1, 'asdlkfjasd56lfjasdpodlfkj', {
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
    onDidDismissSpy.and.returnValue({ data: '' });
    component.ionViewWillEnter();
    fixture.detectChanges();
    const spyNav = spyOn(navController, 'navigateForward').and.callThrough();
    const spySend = spyOn(walletTransactionService, 'send').and.callThrough();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(spySend).not.toHaveBeenCalled();
    // This is wrong
    expect(spyNav).toHaveBeenCalledWith('/wallets/send/wrong-password');
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
    expect(modalControllerMock.create).toHaveBeenCalledTimes(1);
  });
});
