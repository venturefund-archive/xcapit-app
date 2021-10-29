import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomeWalletPage } from './home-wallet.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { By } from '@angular/platform-browser';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { of } from 'rxjs';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletTransactionsService } from '../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { ReactiveFormsModule } from '@angular/forms';

const testCoins = {
  test: [
    {
      id: 1,
      name: 'coinTest',
      logoRoute: '../../assets/img/coins/ETH.svg',
      last: false,
      value: 'coinTest',
      network: 'ERC20',
      chainId: 42,
      rpc: 'http://testrpc.test',
    },
  ],
  usdBalanceTest: [
    {
      id: 2,
      name: 'ETH - Ethereum',
      logoRoute: '../../assets/img/coins/ETH.svg',
      last: false,
      value: 'ETH',
      network: 'ETH',
      chainId: 42,
      rpc: 'http://testrpc.test',
    },
    {
      id: 6,
      name: 'RBTC - Smart Bitcoin',
      logoRoute: '../../assets/img/coins/RBTC.png',
      last: false,
      value: 'RBTC',
      network: 'RSK',
      chainId: 31,
      rpc: 'http://testrpc.test',
    },
    {
      id: 3,
      name: 'USDT - Tether',
      logoRoute: '../../assets/img/coins/USDT.svg',
      last: false,
      value: 'USDT',
      network: 'ETH',
      chainId: 42,
      rpc: 'http://testrpc.test',
      decimals: 6,
    },
  ],
};

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

const transaction = [
  {
    icon: 'assets/img/wallet-transactions/received.svg',
    type: 'received',
    asset: 'ETH',
    from: '0x00000000000000000000000000',
    to: '0x00000000000000000000000001',
    value: '0.2',
    hash: '0x000000000000000000000000000000000000000000001',
    blockNumber: '0x00000001',
    erc721: false,
    rawContract: false,
    swap: {
      currencyIn: '',
      currencyOut: '',
      amountIn: null,
      amountOut: null,
    },
  },
];

describe('HomeWalletPage', () => {
  let component: HomeWalletPage;
  let fixture: ComponentFixture<HomeWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HomeWalletPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let walletService: WalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let storageService: StorageService;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let apiWalletService: ApiWalletService;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getPrices: of({ prices: { ETH: 3000, BTC: 50000, USDT: 1 } }),
      });
      walletServiceSpy = jasmine.createSpyObj(
        'WalletService',
        {
          walletExist: Promise.resolve(true),
          balanceOf: Promise.resolve('20'),
        },
        {
          addresses: { ERC20: 'testAddress' },
        }
      );
      walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionsService', {
        getLastTransaction: Promise.resolve(transaction),
      });
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getAssestsSelected: Promise.resolve(testCoins.test),
        updateAssetsList: Promise.resolve(true),
      });
      TestBed.configureTestingModule({
        declarations: [HomeWalletPage, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule, ReactiveFormsModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
          { provide: StorageService, useValue: storageServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeWalletPage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      component.allPrices = undefined;
      component.userCoins = testCoins.test;
      fixture.detectChanges();
      walletService = TestBed.inject(WalletService);
      apiWalletService = TestBed.inject(ApiWalletService);
      storageService = TestBed.inject(StorageService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if wallet exist on view will enter and there are a wallet', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.walletExist).toBe(true);
  });

  it('should check if wallet exist on view will enter and there are not a wallet', async () => {
    walletServiceSpy.walletExist.and.returnValue(Promise.resolve(false));
    await component.ionViewWillEnter();
    expect(component.walletExist).toBe(false);
  });

  it('should not render app-wallets-subheader when walletExist is true', () => {
    component.walletExist = true;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__subheader'));
    expect(subheader).toBeNull();
  });

  it('should render app-wallets-buttons-subheader when walletExist is true', () => {
    component.walletExist = true;
    component.transactionsExists = false;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__overlap_buttons'));
    expect(subheader).not.toBeNull();
  });

  it('should not render app-wallets-buttons-subheader when walletExist is false', () => {
    component.walletExist = false;
    component.transactionsExists = undefined;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__overlap_buttons'));
    expect(subheader).toBeNull();
  });

  it('should render app-wallet-balance-card when walletExist is true and have transactions and balance', () => {
    component.walletExist = true;
    component.transactionsExists = true;
    component.balances = balances;
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).not.toBeNull();
  });

  it('should render app-wallet-balance-card when walletExist is true and dont have transactions', () => {
    component.walletExist = true;
    component.transactionsExists = false;
    component.balances = balances;
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).not.toBeNull();
  });

  it('should not render app-wallet-balance-card when walletExist is true and have transactions but nor balances', () => {
    component.walletExist = true;
    component.transactionsExists = false;
    component.balances = [];
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).toBeNull();
  });

  it('should not render app-wallet-balance-card when walletExist is false and have balances', () => {
    component.walletExist = false;
    component.balances = balances;
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).toBeNull();
  });

  it('should not render app-wallet-transaction-card when walletExist is true and dont have transactions', () => {
    component.walletExist = true;
    component.transactionsExists = false;
    fixture.detectChanges();
    const transactionElement = fixture.debugElement.query(By.css('.wt__transaction'));
    expect(transactionElement).toBeNull();
  });

  it('should get the last transaction on view will enter', async () => {
    fixture.detectChanges();
    await component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.walletExist).toBe(true);
    expect(component.transactionsExists).toBe(true);
    expect(component.lastTransaction).toEqual(transaction);
  });

  it('should show the total balance in USD on getWalletsBalances', async () => {
    (Object.getOwnPropertyDescriptor(walletService, 'addresses').get as jasmine.Spy).and.returnValue({
      ETH: 'testAddressEth',
      RSK: 'testAddressRsk',
    });
    component.userCoins = testCoins.usdBalanceTest;
    component.allPrices = { prices: { ETH: 3000, BTC: 50000, USDT: 1 } };
    const expectedBalance = 1060020;

    await component.getWalletsBalances();

    expect(component.totalBalanceWallet).toBe(expectedBalance);
  });

  it('should call appTrackEvent on trackService when Import Wallet clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Import Wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate when goToRecoveryWallet is called', async () => {
    component.goToRecoveryWallet();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/create-first/disclaimer', 'import']);
  });

  it('should show the total balance in USD on ionViewWillEnter', fakeAsync(() => {
    storageServiceSpy.getAssestsSelected.and.returnValue(Promise.resolve(testCoins.usdBalanceTest));
    (Object.getOwnPropertyDescriptor(walletService, 'addresses').get as jasmine.Spy).and.returnValue({
      ETH: 'testAddressEth',
      RSK: 'testAddressRsk',
    });
    const expectedBalance = 1060020;

    component.ionViewWillEnter();
    tick(350);

    expect(component.totalBalanceWallet).toBe(expectedBalance);
  }));

  it('should show the equivalent of each coin balance in USD on getWalletsBalances', async () => {
    component.userCoins = testCoins.usdBalanceTest;
    (Object.getOwnPropertyDescriptor(walletService, 'addresses').get as jasmine.Spy).and.returnValue({
      ETH: 'testAddressEth',
      RSK: 'testAddressRsk',
    });
    component.allPrices = { prices: { ETH: 3000, BTC: 50000, USDT: 1 } };

    const expectedBalanceRBTC = 1000000;
    const expectedBalanceETH = 60000;
    const expectedBalanceUSDT = 20;

    await component.getWalletsBalances();

    expect(component.balances[0].usdAmount).toBe(expectedBalanceETH);
    expect(component.balances[1].usdAmount).toBe(expectedBalanceRBTC);
    expect(component.balances[2].usdAmount).toBe(expectedBalanceUSDT);
  });

  it('should not sum USD balances if coin price was not found on ionViewWillEnter', fakeAsync(() => {
    storageServiceSpy.getAssestsSelected.and.returnValue(Promise.resolve(testCoins.usdBalanceTest));
    (Object.getOwnPropertyDescriptor(walletService, 'addresses').get as jasmine.Spy).and.returnValue({
      ETH: 'testAddressEth',
      RSK: 'testAddressRsk',
    });
    apiWalletServiceSpy.getPrices.and.returnValue(of({ prices: { ETH: null, BTC: null, USDT: 1 } }));
    const expectedBalance = 20;

    component.ionViewWillEnter();
    tick(350);

    expect(component.totalBalanceWallet).toBe(expectedBalance);
  }));

  it('should render selected tab', async () => {
    component.walletExist = true;
    component.transactionsExists = true;
    component.balances = balances;
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(fixture.debugElement.query(By.css('.wt__balance'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.wt__nfts'))).not.toBeTruthy();
    component.segmentsForm.patchValue({ tab: 'nft' });
    fixture.debugElement.query(By.css('ion-segment-button[value="nft"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(fixture.debugElement.query(By.css('.wt__balance'))).not.toBeTruthy();
    expect(fixture.debugElement.query(By.css('.wt__nfts'))).toBeTruthy();
  });
});
