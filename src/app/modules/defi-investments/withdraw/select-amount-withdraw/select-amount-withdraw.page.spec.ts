import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { Vault } from '@2pi-network/sdk';
import { SelectAmountWithdrawPage } from './select-amount-withdraw.page';
import { TwoPiApi } from '../../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { TwoPiInvestment } from '../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { By } from '@angular/platform-browser';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import { of } from 'rxjs';
import { TwoPiInvestmentFactory } from '../../shared-defi-investments/models/two-pi-investment/factory/two-pi-investment-factory';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';

const testVault = {
  apy: 0.227843965358873,
  balances: [],
  contract_address: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38',
  deposits: [],
  identifier: 'polygon_usdc',
  pid: 1,
  token: 'USDC',
  token_address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
  tvl: 1301621680000,
} as Vault;

const formData = {
  valid: {
    percentage: '100',
    range: '100',
    amount: 25,
    quoteAmount: 24,
  },
  invalid: {
    percentage: '',
    range: '',
    amount: '',
    quoteAmount: '',
  },
};

describe('SelectAmountWithdrawPage', () => {
  let component: SelectAmountWithdrawPage;
  let fixture: ComponentFixture<SelectAmountWithdrawPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SelectAmountWithdrawPage>;
  let twoPiApiSpy: jasmine.SpyObj<TwoPiApi>;
  let investmentDataServiceSpy: jasmine.SpyObj<InvestmentDataService>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let investmentSpy: jasmine.SpyObj<TwoPiInvestment>;
  let dynamicPriceFactorySpy: jasmine.SpyObj<DynamicPriceFactory>;
  let dynamicPriceSpy: jasmine.SpyObj<DynamicPrice>;
  let twoPiInvestmentFactory: jasmine.SpyObj<TwoPiInvestmentFactory>;
  let coinsSpy: jasmine.SpyObj<Coin>[];

  beforeEach(
    waitForAsync(() => {
      investmentDataServiceSpy = jasmine.createSpyObj(
        'InvestmentDataService',
        {},
        {
          amount: 10,
          quoteAmount: 12,
          product: {},
        }
      );

      twoPiApiSpy = jasmine.createSpyObj('TwoPiApi', {
        vault: Promise.resolve(testVault),
      });

      coinsSpy = [
        jasmine.createSpyObj('Coin', {}, { name: 'USDC - USD Coin', value: 'USDC', network: 'MATIC' }),
        jasmine.createSpyObj('Coin', {}, { name: 'MATIC', value: 'MATIC', network: 'MATIC', native: true }),
      ];

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
        getCoins: coinsSpy,
      });

      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionServiceSpy', {
        getEncryptedWallet: Promise.resolve({ addresses: { MATIC: '0x0000001' } }),
      });

      fakeActivatedRoute = new FakeActivatedRoute({ vault: 'polygon_usdc', mode: 'invest' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();

      dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(2) });

      dynamicPriceFactorySpy = jasmine.createSpyObj('DynamicPriceFactory', {
        new: dynamicPriceSpy,
      });

      investmentSpy = jasmine.createSpyObj('TwoPiInvestment', {
        balance: Promise.resolve(50),
      });

      twoPiInvestmentFactory = jasmine.createSpyObj('TwoPiInvestmentFactory', {
        new: investmentSpy,
      });

      TestBed.configureTestingModule({
        declarations: [SelectAmountWithdrawPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: TwoPiApi, useValue: twoPiApiSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: InvestmentDataService, useValue: investmentDataServiceSpy },
          { provide: DynamicPriceFactory, useValue: dynamicPriceFactorySpy },
          { provide: TwoPiInvestmentFactory, useValue: twoPiInvestmentFactory },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectAmountWithdrawPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when submit withdraw amount button is clicked', async () => {
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_invest_continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe when leave', () => {
    const nextSpy = spyOn(component.destroy$, 'next');
    const completeSpy = spyOn(component.destroy$, 'complete');
    component.ionViewWillLeave();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should render amount input card when invested Amount not null or undefined', async () => {
    component.investedAmount = 30;
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const amountInputCardEl = fixture.debugElement.query(By.css('app-amount-input-card'));
    expect(amountInputCardEl).toBeTruthy();
  });

  it('should save withdraw amount and redirect if form is valid', async () => {
    await component.ionViewWillEnter();
    component.form.patchValue({ amount: 20, quoteAmount: 20 });
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_invest_continue"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/defi/withdraw/confirmation', 'polygon_usdc']);
  });

  it('should redirect with an additional parameter if it is a total withdrawal', async () => {
    await component.ionViewWillEnter();
    component.form.patchValue({ range: 100, amount: 20, quoteAmount: 20 });
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_invest_continue"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      '/defi/withdraw/confirmation',
      'polygon_usdc',
      'all',
    ]);
  });

  it('should not save withdraw amount nor redirect if form is not valid', async () => {
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_invest_continue"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
  });
});
