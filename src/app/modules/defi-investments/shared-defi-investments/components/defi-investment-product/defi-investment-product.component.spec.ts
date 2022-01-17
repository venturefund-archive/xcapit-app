import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BigNumber } from 'ethers';
import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TwoPiService } from '../../services/two-pi/two-pi.service';
import { DefiInvestmentProductComponent } from './defi-investment-product.component';

const defiProduct = {
  id: 'polygon-usdc-aave',
  symbol: 'USDC',
  subtitle: 'USD coin',
  isComming: false,
};

describe('DefiInvestmentProductComponent', () => {
  let component: DefiInvestmentProductComponent;
  let fixture: ComponentFixture<DefiInvestmentProductComponent>;
  let vaultSpy: jasmine.SpyObj<any>;
  let twoPiServiceSpy: jasmine.SpyObj<TwoPiService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DefiInvestmentProductComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      walletServiceSpy = jasmine.createSpyObj('WalletService',
        {
          walletExist: Promise.resolve(true),
        });

      vaultSpy = jasmine.createSpyObj(
        'vault',
        {
          apy: Promise.resolve(0.2278444),
          tvl: Promise.resolve(BigNumber.from('0x012f0eb2a88a')),
          tokenDecimals: Promise.resolve(BigNumber.from(6)),
        },
        {
          id: 'polygon-usdc-aave',
        }
      );

      twoPiServiceSpy = jasmine.createSpyObj('TwoPiService', {
        getVaults: [vaultSpy],
      });

      TestBed.configureTestingModule({
        declarations: [DefiInvestmentProductComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule],
        providers: [
          { provide: TwoPiService, useValue: twoPiServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DefiInvestmentProductComponent);
      component = fixture.componentInstance;
      component.product = defiProduct;
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
});
