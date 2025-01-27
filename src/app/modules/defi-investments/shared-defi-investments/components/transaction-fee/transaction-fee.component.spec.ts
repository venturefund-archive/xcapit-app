import { DebugElement, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { TransactionFeeComponent } from './transaction-fee.component';

describe('TransactionFeeComponent', () => {
  let component: TransactionFeeComponent;
  let fixture: ComponentFixture<TransactionFeeComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<TransactionFeeComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let dynamicPriceFactorySpy: jasmine.SpyObj<DynamicPriceFactory>;
  let dynamicPriceSpy: jasmine.SpyObj<DynamicPrice>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;

  const _infoCircleBtn = (): DebugElement => {
    return fixture.debugElement.query(By.css('ion-icon[name="information-circle"]'));
  }

  const _skeletonText = (): DebugElement => fixture.debugElement.query(By.css('.skeleton ion-skeleton-text'));

  const _divAdvice = (): DebugElement => {
    return fixture.debugElement.query(By.css('div.tf__fee__qty_and_advice__funds-advice'));
  }

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(2) });
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getPrices: of({ prices: { USDT: 1, ETH: 1, BTC: 1, MATIC: 1 } }),
      });
      dynamicPriceFactorySpy = jasmine.createSpyObj('DynamicPriceFactory', {
        new: dynamicPriceSpy,
      });

      TestBed.configureTestingModule({
        declarations: [TransactionFeeComponent, FormattedAmountPipe, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: DynamicPriceFactory, useValue: dynamicPriceFactorySpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TransactionFeeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render advice div when you dont have necessary fee', () => {
    component.fee.value = 2;
    component.balance = 1;
    component.quoteFee.value = 0.0017;
    fixture.detectChanges();

    expect(_divAdvice()).toBeTruthy();
  });

  it('should get quote price on ngOnChanges if autoprice is true', () => {
    const change: SimpleChanges = { fee: new SimpleChange(false, true, true)}
    component.autoPrice = true;

    component.ngOnChanges(change);

    expect(dynamicPriceSpy.value).toHaveBeenCalledTimes(1);
  });

  it('should not get quote price on ngOnChanges if fee dont has a token', () => {
    const change: SimpleChanges = { fee: new SimpleChange(false, true, true)}
    component.autoPrice = true;
    component.fee.token = undefined;

    component.ngOnChanges(change);

    expect(dynamicPriceSpy.value).toHaveBeenCalledTimes(0);
  });

  it('should unsubscribe from last dynamic price if a new change is detected', () => {
    const change: SimpleChanges = { fee: new SimpleChange(false, true, true)}
    component.autoPrice = true;
    component.ngOnChanges(change);
    const dynamicPriceSubscriptionSpy = spyOn(component.dynamicPriceSubscription, 'unsubscribe');

    component.ngOnChanges(change);

    expect(dynamicPriceSubscriptionSpy).toHaveBeenCalledTimes(1);
  });

  it('should not render advice div when you dont have necessary fee', () => {
    component.fee.value = 0.0017;
    fixture.detectChanges();

    expect(_divAdvice()).toBeFalsy();
  });

  it('should render skeleton when quoteFee value is not available', () => {
    component.quoteFee.value = undefined;

    expect(_skeletonText()).toBeTruthy();
  });

  it('should render skeleton when fee value is not available', () => {
    component.fee.value = undefined;

    expect(_skeletonText()).toBeTruthy();
  });

  it('should not render skeleton when quoteFee value and fee value is available', async () => {
    component.quoteFee.value = 0.017;
    component.fee.value = 0.017;

    fixture.detectChanges();
    await fixture.whenStable();

    expect(_skeletonText()).toBeFalsy();
  });

  it('should call clickEvent on trackService when transaction_fee clicked', () => {
    component.transactionFee = true;
    fixture.detectChanges();
    const el = _infoCircleBtn();
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit event when transaction_fee fee clicked', () => {
    component.transactionFee = true;
    fixture.detectChanges();
    const spy = spyOn(component.transactionFeeInfoClicked, 'emit');

    _infoCircleBtn().nativeElement.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show default fee info modal when transaction_fee fee is clicked & defaultFeeInfo is true', () => {
    component.defaultFeeInfo = true;
    fixture.detectChanges();
    const spy = spyOn(component.transactionFeeInfoClicked, 'emit');

    _infoCircleBtn().nativeElement.click();

    expect(spy).toHaveBeenCalledTimes(0);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show default fee info modal only ones when transaction_fee fee is clicked more than one time & defaultFeeInfo is true', () => {
    component.defaultFeeInfo = true;
    fixture.detectChanges();
    const infoButtonel = _infoCircleBtn();

    infoButtonel.nativeElement.click();
    infoButtonel.nativeElement.click();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe when the component is destroyed', () => {
    const nextSpy = spyOn(component.destroy$, 'next');
    const completeSpy = spyOn(component.destroy$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
});
