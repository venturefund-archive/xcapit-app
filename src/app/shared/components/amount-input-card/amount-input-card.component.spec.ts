import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { AmountInputCardComponent } from './amount-input-card.component';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { DynamicPrice } from '../../models/dynamic-price/dynamic-price.model';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';

const testCoins = [
  {
    id: 0,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    native: true,
  },
  {
    id: 1,
    name: 'LINK - Chainlink',
    logoRoute: 'assets/img/coins/LINK.png',
    last: false,
    value: 'LINK',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    contract: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
    decimals: 18,
  },
];
describe('AmountInputCardComponent', () => {
  let component: AmountInputCardComponent;
  let fixture: ComponentFixture<AmountInputCardComponent>;
  let controlContainerMock: FormGroup;
  let formGroupDirectiveMock: FormGroupDirective;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;
  let dynamicPriceSpy: jasmine.SpyObj<DynamicPrice>;
  let createDynamicPriceSpy: jasmine.Spy<any>;
  beforeEach(
    waitForAsync(() => {
      dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(4000) });
      controlContainerMock = new FormBuilder().group({
        amount: ['', []],
        quoteAmount: ['', []],
        percentage: ['', []],
        range: ['', []],
      });
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getPrices: of({ prices: { ETH: 4000 } }),
        getCoins: testCoins,
      });
      walletBalanceServiceSpy = jasmine.createSpyObj(
        'WalletBalanceService',
        { balanceOf: Promise.resolve(20) },
        { addresses: { ERC20: 'testAddress' } }
      );

      formGroupDirectiveMock = new FormGroupDirective([], []);
      formGroupDirectiveMock.form = controlContainerMock;
      TestBed.configureTestingModule({
        declarations: [AmountInputCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: WalletBalanceService, useValue: walletBalanceServiceSpy },
        ],
        schemas:[CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(AmountInputCardComponent);
      component = fixture.componentInstance;
      component.baseCurrency = testCoins[0];
      createDynamicPriceSpy = spyOn(component, 'createDynamicPrice').and.returnValue(dynamicPriceSpy);
      component.investedAmount = 100;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get token price on init', () => {
    expect(component.price).toEqual(4000);
    component.ngOnDestroy();
  });

  it('should calculate usd price when amount changes', () => {
    component.form.patchValue({ amount: 20 });
    expect(component.form.value.quoteAmount).toEqual('80000');
    component.ngOnDestroy();
  });

  it('should not show scientific notation on USD amount', () => {
    component.form.patchValue({ amount: 1e-20 });
    expect(component.form.value.quoteAmount).not.toContain('e');
    component.ngOnDestroy();
  });

  it('should create dynamic price', () => {
    createDynamicPriceSpy.and.callThrough();
    expect(component.createDynamicPrice()).toBeTruthy();
  });

  it('should set available on max clicked', () => {
    fixture.debugElement.query(By.css('ion-button.aic__content__inputs__amount_with_max__max')).nativeElement.click();
    fixture.detectChanges();
    expect(component.form.value.amount).toEqual(20);
  });

  it('should calculate amount when quote amount changes', () => {
    component.form.patchValue({ quoteAmount: 20 });
    expect(component.form.value.amount).toEqual(0.005);
    component.ngOnDestroy();
  });

  it('should patch full user investment when the user enters a value higher than 100% on quoteAmount', async () => {
    component.showRange = true;
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.form.patchValue({ quoteAmount: 400000 });
    expect(component.form.value.percentage).toEqual(100);
    expect(component.form.value.range).toEqual(100);
    expect(component.form.value.amount).toEqual(100);
  });

  it('should patch full user investment when the user enters a value higher than 100% on percentage', async () => {
    component.showRange = true;
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.form.patchValue({ percentage: 140 });
    expect(component.form.value.range).toEqual(100);
    expect(component.form.value.amount).toEqual(100);
    expect(component.form.value.quoteAmount).toEqual('400000');
  });

  it('should patch full user investment when the user enters a value higher than 100% on amount', async () => {
    component.isSend = false;
    component.showRange = true;
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.form.patchValue({ amount: 101 });
    expect(component.form.value.percentage).toEqual(100);
    expect(component.form.value.range).toEqual(100);
    expect(component.form.value.amount).toEqual(100);
    expect(component.form.value.quoteAmount).toEqual('400000');
  });

  it('should patch full user available amount when the user enters a value higher than 100% on amount', async () => {
    component.isSend = true;
    component.showRange = false;
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.form.patchValue({ amount: 21 });
    expect(component.form.value.amount).toEqual(20);
    expect(component.form.value.quoteAmount).toEqual('80000');
  });

  it('should patch full available USD when the user enters a value higher than 100% on quoteAmount', async () => {
    component.showRange = false;
    component.isSend = true;
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.form.patchValue({ quoteAmount: 400000 });
    expect(component.form.value.amount).toEqual(20);
  });

  it('should calculate all inputs when range changes', async () => {
    component.showRange = true;
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.form.patchValue({ range: 10 });
    expect(component.form.value.percentage).toEqual(10);
    expect(component.form.value.amount).toEqual(10);
    expect(component.form.value.quoteAmount).toEqual('40000');
  });

  it('should calculate all inputs when percentage changes', async () => {
    component.showRange = true;
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.form.patchValue({ percentage: 10 });
    expect(component.form.value.range).toEqual(10);
    expect(component.form.value.amount).toEqual(10);
    expect(component.form.value.quoteAmount).toEqual('40000');
  });

  it('should calculate all inputs when range changes', async () => {
    component.showRange = true;
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.form.patchValue({ range: 10 });
    expect(component.form.value.percentage).toEqual(10);
    expect(component.form.value.amount).toEqual(10);
    expect(component.form.value.quoteAmount).toEqual('40000');
  });

  it('should render percentage and range when showRange', async () => {
    component.showRange = true;
    component.ngOnInit();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const percentageEl = fixture.debugElement.query(By.css('div.aic__content__percentage'));
    const rangeEl = fixture.debugElement.query(By.css('.aic__content ion-range'));
    expect(percentageEl).toBeTruthy();
    expect(rangeEl).toBeTruthy();
  });

  it('should not render range and percentage when showRange false', async () => {
    component.showRange = false;
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const percentageEl = fixture.debugElement.query(By.css('div.aic__content__percentage'));
    const rangeEl = fixture.debugElement.query(By.css('.aic__content ion-range'));
    expect(percentageEl).toBe(null);
    expect(rangeEl).toBe(null);
  });

  it('should render loader when showRange false and available is not available yet', () => {
    component.showRange = false;
    walletBalanceServiceSpy.balanceOf.and.resolveTo(null)
    
    const loaderEl = fixture.debugElement.query(By.css('app-ux-loading-block'));
    expect(loaderEl).toBeTruthy();
  });

  it('should render properly available div', async () => {
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const availableEl = fixture.debugElement.query(By.css('.aic__available'));
    expect(availableEl.nativeElement.innerHTML).toBeTruthy();
  });

  it('should subtract the fee from available balance when the currency is native', () => {
    component.baseCurrency = testCoins[0];
    component.nativeFee = 1;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.available).toEqual(20);
  });

  it('should recalculate available balance and re-set Max if applicable when nativeFee changes', async () => {
    component.baseCurrency = testCoins[0];
    component.nativeFee = 1;
    component.ngOnInit();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.setMax();
    expect(component.available).toEqual(19);
    expect(component.form.value.amount).toEqual(19);

    component.nativeFee = 2;
    await component.ngOnChanges({ nativeFee: new SimpleChange(1, 2, true) });
    fixture.detectChanges();
    expect(component.available).toEqual(18);
    expect(component.form.value.amount).toEqual(18);
  });

  it('should do nothing if there are no changes in nativeFee', async() => {
    component.baseCurrency = testCoins[0];
    component.nativeFee = 1;
    component.ngOnInit();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(component.available).toEqual(19);

    await component.ngOnChanges({ nativeFee: new SimpleChange(null, null, true) });
    fixture.detectChanges();
    expect(component.available).toEqual(19);
  })
});
