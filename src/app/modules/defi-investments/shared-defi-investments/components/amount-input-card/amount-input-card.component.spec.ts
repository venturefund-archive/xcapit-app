import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync, fakeAsync, flush, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { AmountInputCardComponent } from './amount-input-card.component';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { DynamicPrice } from '../../../../../shared/models/dynamic-price/dynamic-price.model';
import { By } from '@angular/platform-browser';

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
      });
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getPrices: of({ prices: { ETH: 4000 } }),
        getCoins: testCoins,
      });
      walletBalanceServiceSpy = jasmine.createSpyObj(
        'WalletBalanceService',
        { balanceOf: Promise.resolve('20') },
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
      }).compileComponents();

      fixture = TestBed.createComponent(AmountInputCardComponent);
      component = fixture.componentInstance;
      component.baseCurrency = testCoins[0];
      createDynamicPriceSpy = spyOn(component, 'createDynamicPrice').and.returnValue(dynamicPriceSpy);
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
    component.form.patchValue({ amount: 1e-7 });
    expect(component.form.value.quoteAmount).not.toContain('e');
    component.ngOnDestroy();
  });

  it('should create dynamic price', () => {
    createDynamicPriceSpy.and.callThrough();
    expect(component.createDynamicPrice()).toBeTruthy();
  });

  it('should set available on max clicked', () => {
    fixture.debugElement.query(By.css('.aic__content__inputs__amount ion-button')).nativeElement.click();
    fixture.detectChanges();
    expect(component.form.value.amount).toEqual('20');
  });

  it('should calculate amount when quote amount changes', () => {
    component.form.patchValue({ quoteAmount: 20 });
    expect(component.form.value.amount).toEqual('0.005');
    component.ngOnDestroy();
  });
});
