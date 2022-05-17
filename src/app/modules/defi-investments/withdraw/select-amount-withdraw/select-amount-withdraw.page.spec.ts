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
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { TwoPiInvestment } from '../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { By } from '@angular/platform-browser';

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

const usdc_coin = {
  id: 8,
  name: 'USDC - USD Coin',
  logoRoute: 'assets/img/coins/USDC.png',
  last: false,
  value: 'USDC',
  network: 'MATIC',
  chainId: 80001,
  rpc: 'http://testrpc.text/',
  moonpayCode: 'usdc_polygon',
  decimals: 6,
  symbol: 'USDCUSDT',
};

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
  let investmentProductSpy: jasmine.SpyObj<InvestmentProduct>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let coinSpy: jasmine.SpyObj<Coin>;
  let investmentSpy: jasmine.SpyObj<TwoPiInvestment>;
  beforeEach(
    waitForAsync(() => {
      investmentProductSpy = jasmine.createSpyObj('InvestmentProduct', {
        id: 3,
        token: coinSpy,
        contractAddress: '0x0000001',
        name: 'polygon_usdc',
      });

      investmentDataServiceSpy = jasmine.createSpyObj(
        'InvestmentDataService',
        {},
        {
          amount: 10,
          quoteAmount: 12,
          product: {},
        }
      );

      coinSpy = jasmine.createSpyObj(
        {},
        {
          name: 'USDC - USD Coin',
          value: 'USDC',
          network: 'MATIC',
          decimals: 6,
        }
      );

      investmentSpy = jasmine.createSpyObj('TwoPiInvestment', {
        balance: Promise.resolve(50),
      });

      twoPiApiSpy = jasmine.createSpyObj('TwoPiApi', {
        vault: Promise.resolve(testVault),
      });

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
        getCoins: [usdc_coin],
      });

      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionServiceSpy', {
        getEncryptedWallet: Promise.resolve({ addresses: { MATIC: '0x0000001' } }),
      });

      fakeActivatedRoute = new FakeActivatedRoute({ vault: 'polygon_usdc', mode: 'invest' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [SelectAmountWithdrawPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: TwoPiApi, useValue: twoPiApiSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectAmountWithdrawPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.amountInputCard = jasmine.createSpyObj('AmountInputCardComponent', { ngOnDestroy: null });
      component.investmentProduct = investmentProductSpy;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when submit withdraw amount button is clicked', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'submit_withdraw_amount');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should destroy amount input card on leave', () => {
    component.ionViewWillLeave();
    expect(component.amountInputCard.ngOnDestroy).toHaveBeenCalledTimes(1);
  });

  it('should render amount input card when invested Amount not null or undefined', async () => {
    component.investedAmount = 30;
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const amountInputCardEl = fixture.debugElement.query(By.css('app-amount-input-card'));
    expect(amountInputCardEl).toBeTruthy();
  });

  it('should save withdraw amount and redirect if form is valid', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewWillEnter();
    component.form.patchValue({ amount: 20, quoteAmount: 20 });
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="submit_withdraw_amount"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/defi/withdraw/confirmation', 'polygon_usdc']);
  });

  it('should not save withdraw amount nor redirect if form is not valid', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="submit_withdraw_amount"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
  });
});
