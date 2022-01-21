import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TwoPiContractService } from '../shared-defi-investments/services/two-pi-contract/two-pi-contract.service';
import { DefiInvestmentProductsPage } from './defi-investment-products.page';
import { Vault } from '@2pi-network/sdk';
import { TwoPiApi } from '../shared-defi-investments/models/two-pi-api/two-pi-api.model';

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
describe('DefiInvestmentProductsPage', () => {
  let component: DefiInvestmentProductsPage;
  let fixture: ComponentFixture<DefiInvestmentProductsPage>;
  let twoPiContractServiceSpy: jasmine.SpyObj<TwoPiContractService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let twoPiApiSpy: jasmine.SpyObj<TwoPiApi>;
  beforeEach(waitForAsync(() => {
    twoPiApiSpy = jasmine.createSpyObj('TwoPiApi', {
      // vaults: Promise.resolve([testVault]),
      vault: Promise.resolve(testVault),
    });
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
      getCoins: [usdc_coin],
    });
    twoPiContractServiceSpy = jasmine.createSpyObj('TwoPiContractService', {
      balance: Promise.resolve()
    })
    TestBed.configureTestingModule({
      declarations: [ DefiInvestmentProductsPage ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(),  RouterTestingModule],
      providers:[{provide: TwoPiContractService, useValue: twoPiContractServiceSpy}, { provide: ApiWalletService, useValue: apiWalletServiceSpy },],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DefiInvestmentProductsPage);
    component = fixture.componentInstance;
  }));
  
  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render active investment card when have balance in at least one defi product', async () => {
    twoPiContractServiceSpy.balance.and.resolveTo(50);
    component.ngOnInit();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const headerEl = fixture.debugElement.query(By.css('div.dp__card > ion-item > ion-label'));
    expect(headerEl.nativeElement.innerHTML).toContain('defi_investments.defi_investment_products.title_investments');
    const componentEl = fixture.debugElement.query(By.css('app-investment-balance-item'));
    expect(componentEl).toBeTruthy();
  });

  it('should display the available investment product card when the user has no balance on the product', async () => {
    twoPiContractServiceSpy.balance.and.resolveTo(0);
    component.ngOnInit();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
  
    const headerEl = fixture.debugElement.query(By.css('div.dp__card > ion-item > ion-label'));
    expect(headerEl.nativeElement.innerHTML).toContain('defi_investments.defi_investment_products.title');
    const componentEl = fixture.debugElement.query(By.css('app-defi-investment-product'));
    expect(componentEl).toBeTruthy();
  });
});
