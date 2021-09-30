import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AssetDetailPage } from './asset-detail.page';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { By } from '@angular/platform-browser';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { of } from 'rxjs';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletTransactionsService } from '../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

const testCoin = {
  test: [
    {
      id: 2,
      name: 'ETH - Ethereum',
      logoRoute: '../../assets/img/coins/ETH.svg',
      last: false,
      value: 'ETH',
      network: 'ERC20',
      rpc: 'http://testrpc.test',
    },
  ],
};

const balances: Array<AssetBalance> = [
  {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'ETH - Ethereum',
    amount: 20,
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

describe('AssetDetailPage', () => {
  let component: AssetDetailPage;
  let fixture: ComponentFixture<AssetDetailPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let walletService: WalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let storageService: StorageService;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let apiWalletService: ApiWalletService;
  let activatedRouteMock: any;

  beforeEach(
    waitForAsync(() => {
      activatedRouteMock = {
        snapshot: {
          paramMap: {
            get: () => 'ETH',
          },
        },
      };

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getPrices: of({ prices: { ETH: 3000 } }),
      });
      walletServiceSpy = jasmine.createSpyObj(
        'WalletService',
        {
          balanceOf: Promise.resolve('20'),
        },
        {
          addresses: { ERC20: 'testAddress' },
        }
      );
      walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionsService', {
        getAllTransactions: Promise.resolve(transaction),
      });
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getWalletsAddresses: Promise.resolve('testAddressEth'),
      });
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);

      TestBed.configureTestingModule({
        declarations: [AssetDetailPage],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule, RouterTestingModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(AssetDetailPage);
      component = fixture.componentInstance;
      component.currency = testCoin.test[0];
      component.coins = testCoin.test;
      component.usdPrice = undefined;
      fixture.detectChanges();
      walletService = TestBed.inject(WalletService);
      apiWalletService = TestBed.inject(ApiWalletService);
      storageService = TestBed.inject(StorageService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllTransactions on view will enter', async () => {
    const spy = spyOn(component, 'getAllTransactions');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render app-wallet-transaction-card when transactionsExists is true', () => {
    component.transactionsExists = true;
    component.balance = balances;
    fixture.detectChanges();
    const transactionElement = fixture.debugElement.query(By.css('.wad__transaction__wallet-transaction-card'));
    expect(transactionElement).not.toBeNull();
  });

  it('should not render app-wallet-transaction-card when transactionsExists is false', () => {
    component.transactionsExists = false;
    component.balance = balances;
    fixture.detectChanges();
    const transactionElement = fixture.debugElement.query(By.css('.wad__transaction__wallet-transaction-card'));
    expect(transactionElement).toBeNull();
  });

  it('should get all the transactions on view will enter', async () => {
    fixture.detectChanges();
    await component.ionViewWillEnter();
    await fixture.whenStable();

    expect(component.transactionsExists).toBe(true);
    expect(component.allTransactions).toEqual(transaction);
  });

  it('should show the total balance in USD on getWalletsBalances', async () => {
    (Object.getOwnPropertyDescriptor(walletService, 'addresses').get as jasmine.Spy).and.returnValue({
      ETH: 'testAddressEth',
    });
    component.currency = testCoin.test[0];
    component.usdPrice = { prices: { ETH: 3000 } };
    const expectedBalance = 60000;

    await component.getAssetBalance();
    await fixture.whenStable();

    expect(component.balance[0].usdAmount).toBe(expectedBalance);
  });
});
