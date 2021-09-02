import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomeWalletPage } from './home-wallet.page';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { By } from '@angular/platform-browser';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { WalletTransactionsService } from '../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';

const testCoins = [
  {
    id: 1,
    name: 'coinTest',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: false,
    value: 'coinTest',
    network: 'ERC20',
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
  let navControllerSpy: any;
  let walletServiceSpy: any;
  let walletTransactionsServiceSpy: any;
  let storageServiceMock: any;
  let storageService: StorageService;

  beforeEach(
    waitForAsync(() => {
      walletServiceSpy = jasmine.createSpyObj(
        'WalletService',
        {
          walletExist: Promise.resolve(true),
          balanceOf: Promise.resolve(20),
        },
        {
          addresses: { ERC20: 'testAddress' },
        }
      );
      walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionsService', {
        getLastTransaction: Promise.resolve(transaction),
      });
      storageServiceMock = {
        getAssestsSelected: () => Promise.resolve(testCoins),
        updateAssetsList: () => null,
      };
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [HomeWalletPage],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
          { provide: StorageService, useValue: storageServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
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

  it('should render app-wallets-subheader when walletExist is false', () => {
    component.walletExist = false;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__subheader'));
    expect(subheader).not.toBeNull();
  });

  it('should render app-wallets-subheader when walletExist is true and dont have transactions', () => {
    component.walletExist = false;
    component.transactionsExists = false;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__subheader'));
    expect(subheader).not.toBeNull();
  });

  it('should not render app-wallets-subheader when walletExist is true and have transactions', () => {
    component.walletExist = true;
    component.transactionsExists = true;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__subheader'));
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

  it('should not render app-wallet-balance-card when walletExist is true and dont have transactions', () => {
    component.walletExist = true;
    component.transactionsExists = false;
    component.balances = [];
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).toBeNull();
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

  it('should render app-wallet-transaction-card when walletExist is true and have transactions', () => {
    component.walletExist = true;
    component.transactionsExists = true;
    fixture.detectChanges();
    const transactionElement = fixture.debugElement.query(By.css('.wt__transaction'));
    expect(transactionElement).not.toBeNull();
  });

  it('should get the last transaction on view will enter', async () => {
    fixture.detectChanges();
    await component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.walletExist).toBe(true);
    expect(component.transactionsExists).toBe(true);
    expect(component.lastTransaction).toEqual(transaction);
  });
  //
  // fit('should get eth balance on view will enter', async () => {
  //   component.userCoins = testCoins;
  //   fixture.detectChanges();
  //   await component.ionViewWillEnter();
  //   console.log(component);
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   expect(component.walletExist).toBe(true);
  //   expect(walletServiceSpy.balanceOf).toHaveBeenCalledWith('testAddress', 'coinTest');
  //   expect(component.balances.find(balance => balance.symbol === 'coinTest').amount).toBe(20);
  // });
});
