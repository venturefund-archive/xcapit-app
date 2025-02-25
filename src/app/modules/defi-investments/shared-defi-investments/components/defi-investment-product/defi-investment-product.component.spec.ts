import { SplitStringPipe } from 'src/app/shared/pipes/split-string/split-string.pipe';
import { WalletService } from '../../../../wallets/shared-wallets/services/wallet/wallet.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { DefiInvestmentProductComponent } from './defi-investment-product.component';
import { TwoPiProduct } from '../../models/two-pi-product/two-pi-product.model';
import { Coin } from '../../../../wallets/shared-wallets/interfaces/coin.interface';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DefiInvestment } from '../../interfaces/defi-investment.interface';

describe('DefiInvestmentProductComponent', () => {
  let component: DefiInvestmentProductComponent;
  let fixture: ComponentFixture<DefiInvestmentProductComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DefiInvestmentProductComponent>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let twoPiProductSpy: jasmine.SpyObj<TwoPiProduct>;
  let coinSpy: jasmine.SpyObj<Coin>;
  let nativeTokenSpy: jasmine.SpyObj<Coin>;
  let investmentSpy: jasmine.SpyObj<DefiInvestment>;

  beforeEach(waitForAsync(() => {
    nativeTokenSpy = jasmine.createSpyObj(
      'nativeToken',
      {},
      {
        logoRoute: 'assets/img/coins/MATIC.svg',
      }
    );
    coinSpy = jasmine.createSpyObj(
      'Coin',
      {},
      {
        name: 'USDC - USD Coin',
        logoRoute: 'assets/img/coins/USDC-POLYGON.svg',
        value: 'USDC',
      }
    );
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    walletServiceSpy = jasmine.createSpyObj('WalletService', {
      walletExist: Promise.resolve(true),
    });
    twoPiProductSpy = jasmine.createSpyObj('TwoPiProduct', {
      token: coinSpy,
      nativeToken: nativeTokenSpy,
      tvl: 1301621.68,
      apy: 22.78,
      type: 'Vault',
      provider: '2PI',
      name: 'polygon_usdc',
    });
    investmentSpy = jasmine.createSpyObj('TwoPiInvestment', {}, { product: twoPiProductSpy, continuousEarning: false });
    TestBed.configureTestingModule({
      declarations: [DefiInvestmentProductComponent, FakeTrackClickDirective, SplitStringPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: WalletService, useValue: walletServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DefiInvestmentProductComponent);
    component = fixture.componentInstance;
    component.investment = investmentSpy;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly tvl and apy of vaults', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const performanceEl = fixture.debugElement.query(By.css('ion-badge.dip__footer__badge'));
    expect(performanceEl.nativeElement.innerHTML).toContain('22.78');
  });
});
