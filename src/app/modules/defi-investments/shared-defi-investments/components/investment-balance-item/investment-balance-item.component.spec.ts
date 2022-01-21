import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TwoPiInvestmentProduct } from '../../models/two-pi-investment-product/two-pi-investment-product.model';
import { Vault } from '@2pi-network/sdk';
import { InvestmentBalanceItemComponent } from './investment-balance-item.component';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { of } from 'rxjs';
import { SplitStringPipe } from 'src/app/shared/pipes/split-string/split-string.pipe';

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

describe('InvestmentBalanceItemComponent', () => {
  let component: InvestmentBalanceItemComponent;
  let fixture: ComponentFixture<InvestmentBalanceItemComponent>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  beforeEach(waitForAsync(() => {
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
      getPrices: of({ prices: { USDC: 1 } }),
      getCoins: [usdc_coin],
    });
    TestBed.configureTestingModule({
      declarations: [ InvestmentBalanceItemComponent, SplitStringPipe ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers:[{ provide: ApiWalletService, useValue: apiWalletServiceSpy },]
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentBalanceItemComponent);
    component = fixture.componentInstance;
    component.investmentProduct = new TwoPiInvestmentProduct(testVault, apiWalletServiceSpy);
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
    expect(balanceEl.nativeElement.innerHTML).toContain(50.00);
  });

    it('should render description properly', () => {
    const descriptionEl = fixture.debugElement.query(By.css('div.ibi__content__group  .description'));
    expect(descriptionEl.nativeElement.innerHTML).toContain('USD Coin');
  });

  it('should render converted-balance properly', () => {
    const convertedBalanceEl = fixture.debugElement.query(By.css('div.ibi__content__group  .converted-balance'));
    expect(convertedBalanceEl.nativeElement.innerHTML).toContain(50);
  });


  it('should render image properly', () => {
    const imageEl = fixture.debugElement.query(By.css('.ibi__image .ibi__image__img'));
    expect(imageEl.attributes.src).toContain('assets/img/coins/USDC.png');
  });
  
});

