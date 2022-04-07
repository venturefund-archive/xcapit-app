import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TwoPiApi } from '../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { Vault } from '@2pi-network/sdk';
import { InvestmentDetailPage } from './investment-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { WalletEncryptionService } from '../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { TwoPiInvestment } from '../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { InvestmentProduct } from '../shared-defi-investments/interfaces/investment-product.interface';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { AvailableDefiProducts } from '../shared-defi-investments/models/available-defi-products/available-defi-products.model';

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

describe('InvestmentDetailPage', () => {
  let component: InvestmentDetailPage;
  let fixture: ComponentFixture<InvestmentDetailPage>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let twoPiApiSpy: jasmine.SpyObj<TwoPiApi>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let fakeNavController: FakeNavController;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InvestmentDetailPage>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let investmentSpy: jasmine.SpyObj<TwoPiInvestment>;
  let investmentProductSpy: jasmine.SpyObj<InvestmentProduct>;
  let createInvestmentProductSpy: jasmine.Spy<any>;
  let availableDefiProductsSpy: jasmine.SpyObj<AvailableDefiProducts>;
  let coinSpy: jasmine.SpyObj<Coin>;
  beforeEach(
    waitForAsync(() => {
      fakeActivatedRoute = new FakeActivatedRoute({ vault: 'polygon_usdc' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      walletServiceSpy = jasmine.createSpyObj('WalletService', {
        walletExist: Promise.resolve(true),
      });

      twoPiApiSpy = jasmine.createSpyObj('TwoPiApi', {
        vault: Promise.resolve(testVault),
      });

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getPrices: of({ prices: { USDC: 1 } }),
        getCoins: [coinSpy],
      });

      walletEncryptionServiceSpy = jasmine.createSpyObj(
        'WalletEncryptionServiceSpy',
        {
          getEncryptedWallet: Promise.resolve({ addresses: { MATIC: '0x0000001' } }),
        },
        {
          addresses: { MATIC: '0x0000001' },
        }
      );

      investmentSpy = jasmine.createSpyObj('TwoPiInvestment', {
        balance: Promise.resolve(50),
      });

      coinSpy = jasmine.createSpyObj(
        {},
        {
          name: 'USDC - USD Coin',
          value: 'USDC',
          network: 'MATIC',
          decimals: 6,
        }
      );

      investmentProductSpy = jasmine.createSpyObj('InvestmentProduct', {
        id: 3,
        token: coinSpy,
        contractAddress: '0x00001',
        name: 'polygon_usdc',
      });

      availableDefiProductsSpy = jasmine.createSpyObj('AvailableDefiProducts', {
        value: [{ id: 'polygon_usdc', isComing: false, dailyEarning: true }],
      });

      TestBed.configureTestingModule({
        declarations: [InvestmentDetailPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule],
        providers: [
          { provide: TwoPiApi, useValue: twoPiApiSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(InvestmentDetailPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      createInvestmentProductSpy = spyOn(component, 'createInvestmentProduct').and.resolveTo(investmentProductSpy);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly app-expandable-investment-info component', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const componentEl = fixture.debugElement.query(By.css('app-expandable-investment-info'));
    expect(componentEl).toBeTruthy();
  });

  it('should render properly invested-balance item', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const titleEl = fixture.debugElement.query(By.css('ion-item.invested-balance > ion-label > ion-text'));
    expect(titleEl.nativeElement.innerHTML).toContain('defi_investments.invest_detail.invested_amount');
    const [balanceEl, referenceBalanceEl] = fixture.debugElement.queryAll(
      By.css('div.invested-balance__content__balance ion-text.invested-balance__content__balance__text')
    );
    expect(balanceEl.nativeElement.innerHTML).toContain(50.0);
    expect(referenceBalanceEl.nativeElement.innerHTML).toEqual(' 50.00 USD ');
  });

  it('should redirect user to defi/no-wallet-to-invest if user has no wallet on add_mount button click', async () => {
    component.investmentProduct = investmentProductSpy;
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    walletServiceSpy.walletExist.and.returnValue(Promise.resolve(false));
    fixture.debugElement.query(By.css('ion-button[name="add_amount"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/defi/no-wallet-to-invest']);
  });

  it('should redirect user to new investment page when add_mount button is clicked if user has wallet', async () => {
    component.investmentProduct = investmentProductSpy;
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    fixture.debugElement.query(By.css('ion-button[name="add_amount"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      '/defi/new/insert-amount',
      'polygon_usdc',
      'add',
    ]);
  });

  it('should call trackEvent when add_amount button is clicked', async () => {
    spyOn(component, 'addAmount');
    component.investmentProduct = investmentProductSpy;
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'add_amount');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent when finalize_invest button is clicked', async () => {
    component.investmentProduct = investmentProductSpy;
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'finalize_invest');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should create investment', async () => {
    expect(await component.createInvestment(investmentProductSpy, '0x')).toBeInstanceOf(TwoPiInvestment);
  });

  it('should render disclaimer if product have weekly earnings', async () => {
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const disclaimerEl = fixture.debugElement.query(By.css('div.id__weekly-profit-disclaimer > ion-label'));
    expect(disclaimerEl.nativeElement.innerHTML).toContain('defi_investments.invest_detail.daily_earnings_disclaimer');
  });
});
