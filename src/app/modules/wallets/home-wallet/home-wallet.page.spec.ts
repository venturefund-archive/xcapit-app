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
import { of } from 'rxjs';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';

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
    id: 2,
    name: 'coinTest',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: false,
    value: 'BTC',
    network: 'BTC',
    rpc: 'http://testrpc.test',
  },
  {
    id: 3,
    name: 'coinTest',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: false,
    value: 'BUSD',
    network: 'BUSD',
    rpc: 'http://testrpc.test',
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
    walletAddress: 'testAddress',
  },
];

fdescribe('HomeWalletPage', () => {
  let component: HomeWalletPage;
  let fixture: ComponentFixture<HomeWalletPage>;
  let navControllerSpy: any;
  let walletServiceMock: any;
  let walletService: WalletService;
  let apiWalletServiceMock: any;

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
      fixture.detectChanges();
      walletService = TestBed.inject(WalletService);
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

  it('should render app-wallets-subheader when walletExist is false', () => {
    component.walletExist = false;
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

  it('should get eth balance on view will enter', fakeAsync(() => {
    spyOn(walletService, 'walletExist').and.returnValue(Promise.resolve(true));
    component.coins = coins;
    const spyBalance = spyOn(walletService, 'balanceOf').and.returnValue(Promise.resolve('20'));
    fixture.detectChanges();
    component.ionViewWillEnter();
    tick(850);
    expect(component.walletExist).toBe(true);
    expect(component.balances[0].walletAddress).toBe('testAddress');
    expect(spyBalance).toHaveBeenCalledWith('testAddress', 'ETH');
  }));

  it('should show the total balance in USD on getWalletsBalances', fakeAsync(() => {
    component.balances = [];
    walletServiceMock.addresses = { ETH: 'testAddress', BTC: 'testAddress' };
    component.totalBalanceWallet = 0;
    component.coins = coins;
    const expectedBalance = 1060000;

    component.getWalletsBalances();

    tick(850);
    expect(component.totalBalanceWallet).toBe(expectedBalance);
  }));

  it('should show the total balance in USD on ionViewWillEnter', fakeAsync(() => {
    spyOn(walletService, 'walletExist').and.returnValue(Promise.resolve(true));
    component.totalBalanceWallet = 0;
    walletServiceMock.addresses = { ETH: 'testAddress', BTC: 'testAddress' };
    component.coins = coins;
    const expectedBalance = 1060000;

    component.ionViewWillEnter();

    tick(850);
    expect(component.totalBalanceWallet).toBe(expectedBalance);
  }));

  it('should show the equivalent of each coin balance in USD on getWalletsBalances', fakeAsync(() => {
    component.balances = [];
    walletServiceMock.addresses = { ETH: 'testAddress', BTC: 'testAddress' };
    component.coins = coins;
    const expectedBalanceBTC = 1000000;
    const expectedBalanceETH = 60000;

    component.getWalletsBalances();

    tick(850);
    expect(component.balances[0].usdAmount).toBe(expectedBalanceETH);
    expect(component.balances[1].usdAmount).toBe(expectedBalanceBTC);
  }));
});
