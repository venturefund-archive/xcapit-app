import { SplitStringPipe } from 'src/app/shared/pipes/split-string/split-string.pipe';
import { WalletService } from './../../../../wallets/shared-wallets/services/wallet/wallet.service';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Vault } from '@2pi-network/sdk';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { DefiInvestmentProductComponent } from './defi-investment-product.component';
import { TwoPiInvestmentProduct } from '../../models/two-pi-investment-product/two-pi-investment-product.model';

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

const testVault = {
  apy: 0.227843965358873,
  identifier: 'polygon_usdc',
  tokenDecimals: 6,
  pid: 1,
  token: 'USDC',
  tvl: 1301621680000,
} as Vault;

describe('DefiInvestmentProductComponent', () => {
  let component: DefiInvestmentProductComponent;
  let fixture: ComponentFixture<DefiInvestmentProductComponent>;

  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DefiInvestmentProductComponent>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;

  beforeEach(
    waitForAsync(() => {
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
        getCoins: [usdc_coin],
      });
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      walletServiceSpy = jasmine.createSpyObj('WalletService', {
        walletExist: Promise.resolve(true),
      });
      TestBed.configureTestingModule({
        declarations: [DefiInvestmentProductComponent, FakeTrackClickDirective, SplitStringPipe],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DefiInvestmentProductComponent);
      component = fixture.componentInstance;
      component.investmentProduct = new TwoPiInvestmentProduct(testVault, apiWalletServiceSpy);
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly tvl and apy of vaults', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const liquidityEl = fixture.debugElement.query(By.css('div.dip__content__liquidity__liq > ion-text'));
    expect(liquidityEl.nativeElement.innerHTML).toContain('1,301,621.68 USD');
    const performanceEl = fixture.debugElement.query(By.css('ion-badge.dip__footer__badge'));
    expect(performanceEl.nativeElement.innerHTML).toContain('22.78');
  });

  it('should call trackEvent when Invest button is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Invest');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should redirect user to defi/no-wallet-to-invest if user has no wallet on Invest button click', async () => {
    walletServiceSpy.walletExist.and.returnValue(Promise.resolve(false));
    fixture.debugElement.query(By.css('ion-button[name="Invest"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/defi/no-wallet-to-invest']);
  });

  it('should redirect user to new investment page when Invest button is clicked if user has wallet', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Invest"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/defi/new/insert-amount', 'polygon_usdc']);
  });
});
