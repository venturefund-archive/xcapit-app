import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AssetDetailPage } from './asset-detail.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { By } from '@angular/platform-browser';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { of } from 'rxjs';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletTransactionsService } from '../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { CovalentTransfersResponse } from '../shared-wallets/models/covalent-transfers-response/covalent-transfers-response';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { SplitStringPipe } from 'src/app/shared/pipes/split-string/split-string.pipe';
import { FormattedNetworkPipe } from 'src/app/shared/pipes/formatted-network-name/formatted-network.pipe';
import { ProvidersFactory } from '../../fiat-ramps/shared-ramps/models/providers/factory/providers.factory';
import { Providers } from '../../fiat-ramps/shared-ramps/models/providers/providers.interface';
import { rawProvidersData } from '../../fiat-ramps/shared-ramps/fixtures/raw-providers-data';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { TwoPiApi } from '../../defi-investments/shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { Vault } from '@2pi-network/sdk';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { TwoPiInvestment } from '../../defi-investments/shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { TwoPiInvestmentFactory } from '../../defi-investments/shared-defi-investments/models/two-pi-investment/factory/two-pi-investment-factory';
import { TwoPiProductFactory } from '../../defi-investments/shared-defi-investments/models/two-pi-product/factory/two-pi-product.factory';
import { TransfersFactory } from '../shared-wallets/models/transfers/factory/transfers.factory';

const nativeTransfersResponse = {
  data: {
    address: 'testAddress',
    quote_currency: 'USD',
    items: [
      {
        from_address: 'testFromAddress',
        to_address: 'testToAddress',
        value: '10000000000000000',
        value_quote: 30,
      },
      {
        from_address: 'testFromAddress',
        to_address: 'testAddress',
        value: '10000000000000000',
        value_quote: 30,
      },
    ],
  },
};

const nativeAsset: Coin = {
  id: 2,
  name: 'ETH - Ethereum',
  logoRoute: '../../assets/img/coins/ETH.svg',
  last: false,
  value: 'ETH',
  network: 'ERC20',
  chainId: 42,
  rpc: 'http://testrpc.test',
};

fdescribe('AssetDetailPage', () => {
  let component: AssetDetailPage;
  let fixture: ComponentFixture<AssetDetailPage>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let coinsSpy: jasmine.SpyObj<Coin>[];
  let twoPiApiSpy: jasmine.SpyObj<TwoPiApi>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let twoPiInvestmentFactorySpy: jasmine.SpyObj<TwoPiInvestmentFactory>;
  let twoPiProductFactorySpy: jasmine.SpyObj<TwoPiProductFactory>;
  let transfersFactorySpy: jasmine.SpyObj<TransfersFactory>

  beforeEach(waitForAsync(() => {
    coinsSpy = [
      jasmine.createSpyObj(
        'Coin',
        {},
        {
          value: 'ETH',
          network: 'ERC20',
        }
      ),
      jasmine.createSpyObj(
        'Coin',
        {},
        {
          value: 'AVAX',
          network: 'BSC_BEP20',
        }
      ),
      jasmine.createSpyObj(
        'Coin',
        {},
        {
          name: 'USDC - USD Coin',
          value: 'USDC',
          network: 'MATIC',
          decimals: 6,
        }
      ),
    ];

    twoPiApiSpy = jasmine.createSpyObj('TwoPiApi', {
      vault: Promise.resolve({
        apy: 0.227843965358873,
        balances: [],
        contract_address: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38',
        deposits: [],
        identifier: 'polygon_usdc',
        pid: 1,
        token: 'USDC',
        token_address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
        tvl: 1301621680000,
      } as Vault),
    });

    fakeActivatedRoute = new FakeActivatedRoute({ currency: 'ETH' });
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getPrices: of({ prices: { ETH: 3000 } }),
      getCoins: coinsSpy,
    });
    walletServiceSpy = jasmine.createSpyObj('WalletService', {
      balanceOf: Promise.resolve('20'),
      addresses: { ERC20: 'testAddress' },
      walletExist: Promise.resolve(true),
    });

    walletTransactionsServiceSpy = jasmine.createSpyObj('WalletTransactionsService', {
      getTransfers: of(new CovalentTransfersResponse(nativeTransfersResponse, nativeAsset)),
    });
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve('testAddress'),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    providersSpy = jasmine.createSpyObj('Providers', {
      all: rawProvidersData,
      byAlias: rawProvidersData.find((provider) => provider.alias === 'PX'),
    });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: providersSpy,
    });

    transfersFactorySpy = jasmine.createSpyObj('TransfersFactory', {
      create: {all: ()=> [] },
    });

    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', {
      getObject: [{ test: 'test' }],
    });

    walletEncryptionServiceSpy = jasmine.createSpyObj(
      'WalletEncryptionServiceSpy',
      {
        getEncryptedWallet: Promise.resolve({ addresses: { MATIC: '0x0000001' } }),
      },
      {
        addresses: { MATIC: '0x0000001' },
      }
    );

    twoPiInvestmentFactorySpy = jasmine.createSpyObj('TwoPiInvestmentFactory', {
      new: { balance: () => Promise.resolve(10) },
    });

    twoPiProductFactorySpy = jasmine.createSpyObj('TwoPiProductFactory', {
      create: {
        token: () => ({
          value: 'USDC',
          network: 'MATIC',
        }),
        name: () => 'polygon_usdc',
      },
    });

    TestBed.configureTestingModule({
      declarations: [AssetDetailPage, FormattedAmountPipe, SplitStringPipe, FormattedNetworkPipe],
      imports: [TranslateModule.forRoot(), IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: WalletTransactionsService, useValue: walletTransactionsServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: TwoPiApi, useValue: twoPiApiSpy },
        { provide: RemoteConfigService, useValue: remoteConfigSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: TwoPiInvestmentFactory, useValue: twoPiInvestmentFactorySpy },
        { provide: TwoPiProductFactory, useValue: twoPiProductFactorySpy },
        { provide: TransfersFactory, useValue: transfersFactorySpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get currency on view will enter', async () => {
    expect(component.currency).toBeFalsy();
    await component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.currency).toEqual(coinsSpy[0]);
    expect(component.enabledToBuy).toBeTrue();
  });

  it('should disable purchase when token is not enabled to buy among all providers', async () => {
    fakeActivatedRoute.modifySnapshotParams({ currency: 'AVAX' });
    await component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.enabledToBuy).toBeFalse();
  });

  // // TODO: ver tests
  // // it('should get transfers on view will enter', async () => {
  // //   await component.ionViewWillEnter();
  // //   await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
  // //   fixture.detectChanges();
  // //   expect(component.transfers[0].symbol).toBe('ETH');
  // //   expect(component.transfers[0].type).toBe('OUT');
  // //   expect(component.transfers[0].amount).toBe(0.01);
  // //   expect(component.transfers[1].symbol).toBe('ETH');
  // //   expect(component.transfers[1].type).toBe('IN');
  // //   expect(component.transfers[1].amount).toBe(0.01);
  // //   const transfersEl = fixture.debugElement.query(By.css('app-wallet-transaction-card'));
  // //   expect(transfersEl).not.toBe(null);
  // // });

  it('should get prices and balances on view will enter', async () => {
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const [amountEl, quoteAmountEl] = fixture.debugElement.queryAll(By.css('.wad__available__amounts ion-text'));
    expect(amountEl.nativeElement.innerHTML).toContain(20);
    expect(amountEl.nativeElement.innerHTML).toContain('ETH');
    expect(quoteAmountEl.nativeElement.innerHTML).toContain('USD');
    expect(quoteAmountEl.nativeElement.innerHTML).toContain('60000 USD');
  });

  // it('should get prices and balances on view will enter without prices', async () => {
  //   apiWalletServiceSpy.getPrices.and.returnValues(of({ prices: {} }));
  //   await component.ionViewWillEnter();
  //   await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
  //   fixture.detectChanges();
  //   const [amountEl, quoteAmountEl] = fixture.debugElement.queryAll(By.css('.wad__available__amounts ion-text'));
  //   expect(amountEl.nativeElement.innerHTML).toContain(20);
  //   expect(amountEl.nativeElement.innerHTML).toContain('ETH');
  //   expect(quoteAmountEl).toBe(undefined);
  // });

  // it('should find to product to invest on view will enter', async () => {
  //   fakeActivatedRoute.modifySnapshotParams({ currency: 'USDC' });
  //   await component.ionViewWillEnter();
  //   expect(component.productToInvest.token().value).toEqual('USDC');
  // });

  // it('should navigate to investment detail page when ux_go_to_invest_asset_detail button is clicked and product balance is greater than 0', async () => {
  //   fakeActivatedRoute.modifySnapshotParams({ currency: 'USDC' });
  //   await component.ionViewWillEnter();
  //   fixture.detectChanges();
  //   const buttonEl = fixture.debugElement.query(By.css('.wad__title_and_image ion-button'));
  //   buttonEl.nativeElement.click();
  //   expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/defi/investment-detail/', 'polygon_usdc']);
  // });

  // it('should navigate to insert amount page when ux_go_to_invest_asset_detail button is clicked and product balance isnt greater than 0', async () => {
  //   twoPiInvestmentFactorySpy.new.and.returnValue({ balance: () => Promise.resolve(0) } as TwoPiInvestment);
  //   fakeActivatedRoute.modifySnapshotParams({ currency: 'USDC' });
  //   await component.ionViewWillEnter();
  //   fixture.detectChanges();
  //   const buttonEl = fixture.debugElement.query(By.css('.wad__title_and_image ion-button'));
  //   buttonEl.nativeElement.click();
  //   expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
  //     '/defi/new/insert-amount',
  //     'polygon_usdc',
  //     'invest',
  //   ]);
  // });
});
