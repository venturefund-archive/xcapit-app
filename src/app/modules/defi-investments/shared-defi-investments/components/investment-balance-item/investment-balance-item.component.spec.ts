import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { InvestmentBalanceItemComponent } from './investment-balance-item.component';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { of } from 'rxjs';
import { SplitStringPipe } from 'src/app/shared/pipes/split-string/split-string.pipe';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TwoPiProduct } from '../../models/two-pi-product/two-pi-product.model';
import { Coin } from '../../../../wallets/shared-wallets/interfaces/coin.interface';
import { FormattedAmount } from '../../../../../shared/models/formatted-amount/formatted-amount';
import { FormattedAmountPipe } from '../../../../../shared/pipes/formatted-amount/formatted-amount.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('InvestmentBalanceItemComponent', () => {
  let component: InvestmentBalanceItemComponent;
  let fixture: ComponentFixture<InvestmentBalanceItemComponent>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let navControllerSpy: any;
  let fakeNavController: FakeNavController;
  let twoPiProductSpy: TwoPiProduct;
  let coinSpy: jasmine.SpyObj<Coin>;

  const matic_coin = {
    id: 16,
    last: false,
    logoRoute: 'assets/img/coins/MATIC.svg',
    moonpayCode: 'matic_polygon',
    name: 'MATIC - Polygon',
    native: true,
    network: 'MATIC',
    rpc: 'http://testrpc.text/',
    symbol: 'MATICUSDT',
    value: 'MATIC',
    decimals: 18,
  };

  beforeEach(waitForAsync(() => {
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
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
      getPrices: of({ prices: { USDC: 1 } }),
      getCoins: [coinSpy],
    });
    twoPiProductSpy = jasmine.createSpyObj('TwoPiProduct', {
      token: coinSpy,
      nativeToken: matic_coin,
      tvl: 1301621.68,
      apy: 22.78,
      type: 'Vault',
      provider: '2PI',
      name: 'polygon_usdc',
    });
    TestBed.configureTestingModule({
      declarations: [InvestmentBalanceItemComponent, SplitStringPipe, FormattedAmountPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentBalanceItemComponent);
    component = fixture.componentInstance;
    component.investmentProduct = twoPiProductSpy;
    component.balance = 50;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render symbol properly', () => {
    const symbolEl = fixture.debugElement.query(By.css('div.ibi__content__group  .symbol'));
    expect(symbolEl.nativeElement.innerHTML).toContain('USDC');
  });

  it('should render balance properly', () => {
    const balanceEl = fixture.debugElement.query(By.css('div.ibi__content__group  .balance'));
    expect(balanceEl.nativeElement.innerHTML).toContain(50.0);
  });

  it('should render description properly', async () => {
    component.ngOnInit();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const descriptionEl = fixture.debugElement.query(By.css('div.ibi__content__group  .description'));
    expect(descriptionEl.nativeElement.innerHTML).toEqual(' Usd Coin');
  });

  it('should render converted-balance properly', () => {
    const convertedBalanceEl = fixture.debugElement.query(By.css('div.ibi__content__group  .converted-balance'));
    expect(convertedBalanceEl.nativeElement.innerHTML).toContain(50);
  });

  it('should navigate to investment detail when go_to_invest_detail div is clicked', async () => {
    const clickeableDiv = fixture.debugElement.query(By.css('div[name="go_to_invest_detail"]'));
    clickeableDiv.nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      '/defi/investment-detail',
      component.investmentProduct.name(),
    ]);
  });
});
