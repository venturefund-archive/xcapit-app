import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TwoPiApi } from '../../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { Vault } from '@2pi-network/sdk';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';

import { NewInvestmentPage } from './new-investment.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';

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

const noMoonpayVault = {
  apy: 0.227843965358873,
  balances: [],
  contract_address: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38',
  deposits: [],
  identifier: 'no_moonpay_token',
  pid: 1,
  token: 'NM',
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

const no_moonpay_token = {
  id: 9,
  name: 'NO MOONPAY - NM Coin',
  logoRoute: 'assets/img/coins/NM.png',
  last: false,
  value: 'NM',
  network: 'MATIC',
  chainId: 80001,
  rpc: 'http://testrpc.text/',
  decimals: 6,
  symbol: 'NMUSDT',
};

describe('NewInvestmentPage', () => {
  let component: NewInvestmentPage;
  let fixture: ComponentFixture<NewInvestmentPage>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let twoPiApiSpy: jasmine.SpyObj<TwoPiApi>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<NewInvestmentPage>;
  let investmentDataServiceSpy: jasmine.SpyObj<InvestmentDataService>;
  let investmentProductSpy: jasmine.SpyObj<InvestmentProduct>;
  beforeEach(
    waitForAsync(() => {
      investmentDataServiceSpy = jasmine.createSpyObj(
        'InvestmentDataService',
        {},
        {
          amount: 10,
          quoteAmount: 12,
          investment: {},
        }
      );

      fakeActivatedRoute = new FakeActivatedRoute({ vault: 'polygon_usdc', mode: 'invest' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();

      investmentProductSpy = jasmine.createSpyObj('InvestmentProduct', {
        id: 3,
        token: no_moonpay_token,
        contractAddress: '0x00001',
        name: 'no_moonpay_token',
        value:'NM'
      });

      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();

      twoPiApiSpy = jasmine.createSpyObj('TwoPiApi', {
        vaults: Promise.resolve([testVault]),
        vault: Promise.resolve(testVault),
      });

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
        getCoins: [usdc_coin],
      });

      TestBed.configureTestingModule({
        declarations: [NewInvestmentPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: TwoPiApi, useValue: twoPiApiSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: InvestmentDataService, useValue: investmentDataServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(NewInvestmentPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.amountInputCard = jasmine.createSpyObj('AmountInputCardComponent', { ngOnDestroy: null });
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent when Submit Amount is clicked', async () => {
    await component.ionViewDidEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Submit Amount');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render properly button of component', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="go_to_moonpay"'));
    expect(buttonEl).toBeTruthy();
  });

  it('should not render moonpay text and button when token is not on moonpay', async () => {
    fakeActivatedRoute.modifySnapshotParams({ vault: 'no_moonpay_token', mode: 'invest' });
    twoPiApiSpy.vault.and.resolveTo(noMoonpayVault);
    apiWalletServiceSpy.getCoins.and.returnValue([no_moonpay_token]);
    await component.ionViewDidEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('div[class="ni__footer__text"]'));
    expect(buttonEl).toBeNull();
  });

  it('should navigate to moonpay when go_to_moonpay button is clicked', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="go_to_moonpay"'));
    buttonEl.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/moonpay']);
  });

  it('should save amount and redirect if form is valid', async () => {
    await component.ionViewDidEnter();
    component.form.patchValue({ amount: 20, quoteAmount: 20 });
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Submit Amount"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/defi/new/confirmation', 'invest']);
  });

  it('should not save amount nor redirect if form is not valid', async () => {
    await component.ionViewDidEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Submit Amount"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
  });

  it('should destroy amount input card on leave', () => {
    component.ionViewWillLeave();
    expect(component.amountInputCard.ngOnDestroy).toHaveBeenCalledTimes(1);
  });
});
