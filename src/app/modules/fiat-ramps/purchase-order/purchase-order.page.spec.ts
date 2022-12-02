import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TEST_COINS } from '../../wallets/shared-wallets/constants/coins.test';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { PurchaseOrderPage } from './purchase-order.page';

describe('PurchaseOrderPage', () => {
  let component: PurchaseOrderPage;
  let fixture: ComponentFixture<PurchaseOrderPage>;
  let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let storageOperationServiceSpy: jasmine.SpyObj<StorageOperationService>;
  let clipboardInfoSpy: jasmine.SpyObj<any>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { getCoin: TEST_COINS[0] });
    fakeActivatedRoute = new FakeActivatedRoute({ step: '1' });
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    clipboardInfoSpy = jasmine.createSpyObj(
      'clipboardInfoSpy',
      {},
      {
        value: 'KriptonMarket.alias',
        modalText: 'fiat_ramps.shared.kripton_account_info.alias',
      }
    );
    clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', { write: Promise.resolve() });
    storageOperationServiceSpy = jasmine.createSpyObj('StorageOperationService', {
      getData: {
        amount_in: '7274.994150004679',
        amount_out: '20.20833325',
        country: 'Argentina',
        currency_in: 'ars',
        currency_out: 'MATIC',
        network: 'MATIC',
        price_in: '1',
        operation_id: 676,
        price_out: '359.9997120002304',
        provider: '1',
        type: 'cash-in',
        wallet: '0xd148c6735e1777be439519b32a1a6ef9c8853934',
      },
    });
    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showInfoToast: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      declarations: [PurchaseOrderPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ClipboardService, useValue: clipboardServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: StorageOperationService, useValue: storageOperationServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get currency out on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.currencyOut).toEqual(TEST_COINS[0]);
  });

  it('should get step on ionViewWillEnter and render transfer on step 1', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const transferEl = fixture.debugElement.query(By.css('app-kripton-account-info-card'));
    const voucherEl = fixture.debugElement.query(By.css('app-voucher-card'));
    const currentStepEl = fixture.debugElement.query(By.css('.active')).nativeElement.textContent;
    const stepCounterEl = fixture.debugElement.query(By.css('.step_counter')).nativeElement.textContent;

    expect(transferEl).toBeTruthy();
    expect(voucherEl).toBeNull();
    expect(currentStepEl).toContain('1');
    expect(stepCounterEl).toContain('1 shared.step_counter.of 2');
    expect(component.isFirstStep).toBeTrue();
  });

  it('should get step on ionViewWillEnter and render voucher on step 2', () => {
    fakeActivatedRoute.modifySnapshotParams({ step: '2' });
    component.ionViewWillEnter();
    fixture.detectChanges();
    const transferEl = fixture.debugElement.query(By.css('app-kripton-account-info-card'));
    const voucherEl = fixture.debugElement.query(By.css('app-voucher-card'));
    const currentStepEl = fixture.debugElement.query(By.css('.active')).nativeElement.textContent;
    const stepCounterEl = fixture.debugElement.query(By.css('.step_counter')).nativeElement.textContent;

    expect(transferEl).toBeNull();
    expect(voucherEl).toBeTruthy();
    expect(currentStepEl).toContain('2');
    expect(stepCounterEl).toContain('2 shared.step_counter.of 2');
    expect(component.isFirstStep).toBeFalse();
  });

  it('should render properly', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const headerTitleEl = fixture.debugElement.query(By.css('ion-title.po__header'));
    const stepOfEl = fixture.debugElement.query(By.css('ion-label.step_counter'));
    const [step1El, step2El] = fixture.debugElement.queryAll(By.css('ion-label.po__step-wrapper__step__title'));
    const providerTitleEl = fixture.debugElement.query(By.css('div.po__provider ion-text'));
    const kriptonAccountEl = fixture.debugElement.query(By.css('app-kripton-account-info-card'));
    const purchaseInfoEl = fixture.debugElement.query(By.css('app-kripton-purchase-info'));
    const timerCountDownEl = fixture.debugElement.query(By.css('app-timer-countdown'));

    expect(headerTitleEl.nativeElement.innerHTML).toContain('fiat_ramps.purchase_order.header');
    expect(step1El.nativeElement.innerHTML).toContain('fiat_ramps.purchase_order.step_1');
    expect(step2El.nativeElement.innerHTML).toContain('fiat_ramps.purchase_order.step_2');
    expect(stepOfEl.nativeElement.innerHTML).toContain('shared.step_counter.of');
    expect(providerTitleEl.nativeElement.innerHTML).toContain('fiat_ramps.purchase_order.provider');
    expect(kriptonAccountEl).toBeTruthy();
    expect(timerCountDownEl).toBeTruthy();
    expect(purchaseInfoEl).toBeTruthy();
  });

  it('should copy alias and show toast when copyValue event is triggered', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('app-kripton-account-info-card'))
      .triggerEventHandler('copyValue', clipboardInfoSpy);
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(clipboardServiceSpy.write).toHaveBeenCalledOnceWith({ string: clipboardInfoSpy.value });
    expect(toastServiceSpy.showInfoToast).toHaveBeenCalledOnceWith({
      message: 'fiat_ramps.purchase_order.clipboard_text',
    });
  });

  it('should go to next step when user clicks Continue button', () => {
    fixture.debugElement.query(By.css('ion-button[name="Continue"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/fiat-ramps/purchase-order/2']);
  });
});
