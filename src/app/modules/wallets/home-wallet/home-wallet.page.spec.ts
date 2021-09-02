import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomeWalletPage } from './home-wallet.page';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { By } from '@angular/platform-browser';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { of } from 'rxjs';

const coins: Coin[] = [
  {
    id: 1,
    name: 'coinTest',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ETH',
    rpc: 'http://testrpc.test',
  },
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: '../../assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    rpc: 'http://testrpc.test',
  },
  {
    id: 3,
    name: 'USDT - Tether',
    logoRoute: '../../assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ETH',
    rpc: 'http://testrpc.test',
    decimals: 6,
  },
];

const balances: Array<AssetBalance> = [
  {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'ETH - Ethereum',
    amount: 1,
    usdAmount: 3000,
    usdSymbol: 'USD',
  },
];

fdescribe('HomeWalletPage', () => {
  let component: HomeWalletPage;
  let fixture: ComponentFixture<HomeWalletPage>;
  let navControllerSpy: any;
  let walletServiceMock: any;
  let walletService: WalletService;
  let apiWalletServiceMock: any;
  let apiWalletService: ApiWalletService;

  beforeEach(
    waitForAsync(() => {
      apiWalletServiceMock = {
        getPrices: (tokens) => of({ prices: { ETH: 3000, BTC: 50000 } }),
      };
      walletServiceMock = {
        walletExist: () => Promise.resolve(true),
        balanceOf: (address, coin) => Promise.resolve('20'),
        addresses: { ETH: 'testAddress' },
      };
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [HomeWalletPage],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceMock },
          { provide: ApiWalletService, useValue: apiWalletServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeWalletPage);
      component = fixture.componentInstance;
      component.allPrices = undefined;
      component.coins = coins;
      fixture.detectChanges();
      walletService = TestBed.inject(WalletService);
      apiWalletService = TestBed.inject(ApiWalletService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if wallet exist on view will enter and there are a wallet', async () => {
    await component.ionViewWillEnter();
    expect(component.walletExist).toBe(true);
  });

  it('should check if wallet exist on view will enter and there are not a wallet', async () => {
    spyOn(walletService, 'walletExist').and.returnValue(Promise.resolve(false));
    await component.ionViewWillEnter();
    expect(component.walletExist).toBe(false);
  });

  it('should render app-wallets-subheader when have not balance', () => {
    component.balances = [];
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__subheader'));
    expect(subheader).not.toBeNull();
  });

  it('should not render app-wallets-subheader when walletExist is true and have balance', () => {
    component.walletExist = true;
    component.balances = balances;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__subheader'));
    expect(subheader).toBeNull();
  });

  it('should not render app-wallet-balance-card when walletExist and have balances', () => {
    component.walletExist = true;
    component.balances = balances;
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).not.toBeNull();
  });

  it('should not render app-wallet-balance-card when walletExist and dont have balances', () => {
    component.walletExist = true;
    component.balances = [];
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).toBeNull();
  });

  it('should not render app-wallet-balance-card when walletExist and have balances', () => {
    component.walletExist = false;
    component.balances = balances;
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).toBeNull();
  });

  it('should get eth balance on view will enter', async () => {
    spyOn(walletService, 'walletExist').and.returnValue(Promise.resolve(true));
    const spyBalance = spyOn(walletService, 'balanceOf').and.returnValue(Promise.resolve('20'));
    fixture.detectChanges();
    await component.ionViewWillEnter();
    expect(component.walletExist).toBe(true);
    expect(spyBalance).toHaveBeenCalledWith('testAddress', 'ETH');
  });

  // Acá empiezan mis tests

  it('should show the total balance in USD on getWalletsBalances', fakeAsync(() => {
    walletServiceMock.addresses = { ETH: 'testAddress', RSK: 'testAddress' };
    component.allPrices = { prices: { ETH: 3000, BTC: 50000 } };
    const expectedBalance = 1060020;

    component.getWalletsBalances();

    tick(850);
    expect(component.totalBalanceWallet).toBe(expectedBalance);
  }));

  it('should show the total balance in USD on ionViewWillEnter', fakeAsync(() => {
    walletServiceMock.addresses = { ETH: 'testAddress', RSK: 'testAddress' };
    const expectedBalance = 1060020;

    component.ionViewWillEnter();

    tick(850);
    expect(component.totalBalanceWallet).toBe(expectedBalance);
  }));

  it('should show the equivalent of each coin balance in USD on getWalletsBalances', fakeAsync(() => {
    walletServiceMock.addresses = { ETH: 'testAddress', RSK: 'testAddress' };
    component.allPrices = { prices: { ETH: 3000, BTC: 50000 } };

    const expectedBalanceRBTC = 1000000;
    const expectedBalanceETH = 60000;
    const expectedBalanceUSDT = 20;

    component.getWalletsBalances();

    tick(850);
    expect(component.balances[0].usdAmount).toBe(expectedBalanceETH);
    expect(component.balances[1].usdAmount).toBe(expectedBalanceRBTC);
    expect(component.balances[2].usdAmount).toBe(expectedBalanceUSDT);
  }));

  it('should not sum USD balances if coin price was not found on ionViewWillEnter', fakeAsync(() => {
    walletServiceMock.addresses = { ETH: 'testAddress', RSK: 'testAddress' };
    spyOn(apiWalletService, 'getPrices').and.returnValue(of({ prices: { ETH: null, BTC: null } }));
    const expectedBalance = 20;

    component.ionViewWillEnter();

    tick(850);
    expect(component.totalBalanceWallet).toBe(expectedBalance);
  }));
});
