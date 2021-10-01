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
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

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
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let navController: NavController;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let paramMapSpy: jasmine.SpyObj<any>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    paramMapSpy = jasmine.createSpyObj('QueryParams', { get: undefined });
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', null, { snapshot: { paramMap: paramMapSpy } });
    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showToast: Promise.resolve(),
    });
    transactionDataServiceMock = {
      transactionData: summaryData,
    };
    walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionService', {
      send: () => Promise.resolve(),
    });

    fakeModalController = new FakeModalController(Promise.resolve(), Promise.resolve({ data: 'testPassword' }));
    modalControllerSpy = fakeModalController.createSpy();

    loadingServiceSpy = jasmine.createSpyObj('LoadingService', {
      show: Promise.resolve(),
      dismiss: Promise.resolve(),
    });

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
        { provide: LoadingService, useValue: loadingServiceSpy },
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

  it('should navigate to invalid password page when modal is closed and password is incorrect', async () => {
    component.summaryData = summaryData;
    const spyNav = spyOn(navController, 'navigateForward');
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'invalid' }));
    walletTransactionsServiceSpy.send.and.throwError('invalid password');
    await component.send();
    await fixture.whenStable();
    expect(spyNav).toHaveBeenCalledWith('/wallets/send/error/incorrect-password');
  });

  it('should open modal if redirected from Incorrect Password Page', async () => {
    paramMapSpy.get.and.returnValue('retry');
    await component.ionViewWillEnter();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show loader at the start of transaction and dismiss it afterwards', async () => {
    await component.send();
    await fixture.whenStable();
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should dismiss loader if password incorrect', async () => {
    walletTransactionsServiceSpy.send.and.throwError('invalid password');
    fakeModalController.modifyReturns(null, Promise.resolve({ data: 'invalid' }));
    await component.send();
    await fixture.whenStable();
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should redirect to Wrong Amount Page if amount is bigger than the amount in wallet', async () => {
    walletTransactionsServiceSpy.send.and.throwError('insufficient funds for intrinsic transaction cost ...');
    component.ionViewWillEnter();
    fixture.detectChanges();
    const spyNav = spyOn(navController, 'navigateForward').and.callThrough();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(spyNav).toHaveBeenCalledWith('/wallets/send/error/wrong-amount');
  });

  it('should redirect to Wrong Address Page if could not resolve ENS', async () => {
    walletTransactionsServiceSpy.send.and.throwError('provided ENS name resolves to null ...');
    component.ionViewWillEnter();
    fixture.detectChanges();
    const spyNav = spyOn(navController, 'navigateForward').and.callThrough();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(spyNav).toHaveBeenCalledWith('/wallets/send/error/wrong-address');
  });

  it('should redirect to Wrong Address Page if address is invalid', async () => {
    walletTransactionsServiceSpy.send.and.throwError('invalid address ...');
    component.ionViewWillEnter();
    fixture.detectChanges();
    const spyNav = spyOn(navController, 'navigateForward').and.callThrough();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(spyNav).toHaveBeenCalledWith('/wallets/send/error/wrong-address');
  });

  it('should redirect to Wrong Address Page if address did not pass checksum', async () => {
    walletTransactionsServiceSpy.send.and.throwError('bad address checksum ...');
    component.ionViewWillEnter();
    fixture.detectChanges();
    const spyNav = spyOn(navController, 'navigateForward').and.callThrough();
    fixture.debugElement.query(By.css('ion-button[name="Send"]')).nativeElement.click();
    await fixture.whenStable();
    expect(spyNav).toHaveBeenCalledWith('/wallets/send/error/wrong-address');
  });
});
