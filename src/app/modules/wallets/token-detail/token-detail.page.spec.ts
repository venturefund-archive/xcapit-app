import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync, discardPeriodicTasks } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TokenDetailPage } from './token-detail.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
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
import { TwoPiInvestment } from '../../defi-investments/shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { TwoPiInvestmentFactory } from '../../defi-investments/shared-defi-investments/models/two-pi-investment/factory/two-pi-investment-factory';
import { TwoPiProductFactory } from '../../defi-investments/shared-defi-investments/models/two-pi-product/factory/two-pi-product.factory';
import { TransfersFactory } from '../shared-wallets/models/transfers/factory/transfers.factory';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { WalletsFactory } from '../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { CovalentBalancesController } from '../shared-wallets/models/balances/covalent-balances/covalent-balances.controller';
import { TokenPricesController } from '../shared-wallets/models/prices/token-prices/token-prices.controller';
import {
  rawETHData,
  rawSAMOData,
  rawTokensData,
  rawUSDCData,
} from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import {
  rawBlockchainsData,
  rawEthereumData,
  rawPolygonData,
  rawSolanaData,
} from '../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { FakeWallet } from '../../swaps/shared-swaps/models/wallet/wallet';
import { DefaultBlockchains } from '../../swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainRepo } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { FakeBalances } from '../shared-wallets/models/balances/fake-balances/fake-balances';
import { FakePrices } from '../shared-wallets/models/prices/fake-prices/fake-prices';
import { TokenDetailInjectable } from '../shared-wallets/models/token-detail/injectable/token-detail.injectable';
import { TokenDetail } from '../shared-wallets/models/token-detail/token-detail';
import { SpyProperty } from 'src/testing/spy-property.spec';
import { RefreshTimeoutService } from 'src/app/shared/services/refresh-timeout/refresh-timeout.service';
import { of } from 'rxjs';

describe('TokenDetailPage', () => {
  let component: TokenDetailPage;
  let fixture: ComponentFixture<TokenDetailPage>;

  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let twoPiApiSpy: jasmine.SpyObj<TwoPiApi>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let twoPiInvestmentFactorySpy: jasmine.SpyObj<TwoPiInvestmentFactory>;
  let twoPiProductFactorySpy: jasmine.SpyObj<TwoPiProductFactory>;
  let transfersFactorySpy: jasmine.SpyObj<TransfersFactory>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let walletsFactorySpy: jasmine.SpyObj<WalletsFactory>;
  let covalentBalancesFactorySpy: jasmine.SpyObj<CovalentBalancesController>;
  let tokenPricesFactorySpy: jasmine.SpyObj<TokenPricesController>;
  let tokenDetailInjectableSpy: jasmine.SpyObj<TokenDetailInjectable>;
  let tokenDetailSpy: jasmine.SpyObj<TokenDetail>;
  let refreshTimeoutServiceSpy: jasmine.SpyObj<RefreshTimeoutService>;
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

  beforeEach(waitForAsync(() => {
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

    tokenPricesFactorySpy = jasmine.createSpyObj('TokenPricesController', {
      new: new FakePrices(),
    });
    covalentBalancesFactorySpy = jasmine.createSpyObj('CovalentBalancesController', { new: new FakeBalances() });
    fakeActivatedRoute = new FakeActivatedRoute({ blockchain: rawEthereumData.name, token: rawETHData.contract });
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: rawTokensData,
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    providersSpy = jasmine.createSpyObj('Providers', {
      all: rawProvidersData,
    });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: providersSpy,
    });

    transfersFactorySpy = jasmine.createSpyObj('TransfersFactory', {
      create: { all: () => [] },
    });

    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', {
      getObject: [{ test: 'test' }],
    });

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

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    walletsFactorySpy = jasmine.createSpyObj('WalletsFactory', {
      create: { oneBy: () => Promise.resolve(new FakeWallet()) },
    });

    tokenDetailSpy = jasmine.createSpyObj(
      'TokenDetail',
      {
        fetch: Promise.resolve(),
        cached: Promise.resolve(),
      },
      {
        price: 3000,
        balance: 20,
        quoteSymbol: 'USD',
      }
    );

    tokenDetailInjectableSpy = jasmine.createSpyObj('TokenDetailInjectable', { create: tokenDetailSpy });

    refreshTimeoutServiceSpy = jasmine.createSpyObj('RefreshTimeoutService', {
      isAvailable: true,
      lock: of(),
    });

    TestBed.configureTestingModule({
      declarations: [TokenDetailPage, FormattedAmountPipe, SplitStringPipe, FormattedNetworkPipe],
      imports: [TranslateModule.forRoot(), IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: TwoPiApi, useValue: twoPiApiSpy },
        { provide: RemoteConfigService, useValue: remoteConfigSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: TwoPiInvestmentFactory, useValue: twoPiInvestmentFactorySpy },
        { provide: TwoPiProductFactory, useValue: twoPiProductFactorySpy },
        { provide: TransfersFactory, useValue: transfersFactorySpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: WalletsFactory, useValue: walletsFactorySpy },
        { provide: CovalentBalancesController, useValue: covalentBalancesFactorySpy },
        { provide: TokenPricesController, useValue: tokenPricesFactorySpy },
        { provide: TokenDetailInjectable, useValue: tokenDetailInjectableSpy },
        { provide: RefreshTimeoutService, useValue: refreshTimeoutServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get token template on view will enter', async () => {
    expect(component.tplToken).toBeFalsy();
    await component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.enabledToBuy).toBeTrue();
    expect(component.tplToken).toEqual(rawETHData);
  });

  it('should disable purchase when token is not enabled to buy among all providers', async () => {
    fakeActivatedRoute.modifySnapshotParams({ blockchain: rawSolanaData.name, token: rawSAMOData.contract });

    await component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.enabledToBuy).toBeFalse();
  });

  it('should get prices and balances on view will enter', async () => {
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const [amountEl, quoteAmountEl] = fixture.debugElement.queryAll(By.css('.wad__available__amounts ion-text'));

    expect(amountEl.nativeElement.innerHTML).toContain('20 ETH');
    expect(quoteAmountEl.nativeElement.innerHTML).toContain('60000 USD');
  });

  it('should get prices and balances on view will enter without prices', async () => {
    new SpyProperty(tokenDetailSpy, 'price').value().and.returnValue(null);
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const [amountEl, quoteAmountEl] = fixture.debugElement.queryAll(By.css('.wad__available__amounts ion-text'));

    expect(quoteAmountEl).toBe(undefined);
    expect(amountEl.nativeElement.innerHTML).toContain(20);
    expect(amountEl.nativeElement.innerHTML).toContain('ETH');
  });

  it('should find to product to invest on view will enter', async () => {
    fakeActivatedRoute.modifySnapshotParams({ blockchain: rawPolygonData.name, token: rawUSDCData.contract });
    await component.ionViewWillEnter();

    expect(component.productToInvest.token().value).toEqual('USDC');
  });

  it('should navigate to investment detail page when ux_go_to_invest_asset_detail button is clicked and product balance is greater than 0', async () => {
    fakeActivatedRoute.modifySnapshotParams({ blockchain: rawPolygonData.name, token: rawUSDCData.contract });
    await component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.wad__title_and_image ion-button')).nativeElement.click();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/defi/investment-detail/', 'polygon_usdc']);
  });

  it('should navigate to insert amount page when ux_go_to_invest_asset_detail button is clicked and product balance isnt greater than 0', async () => {
    twoPiInvestmentFactorySpy.new.and.returnValue({ balance: () => Promise.resolve(0) } as TwoPiInvestment);
    fakeActivatedRoute.modifySnapshotParams({ blockchain: rawPolygonData.name, token: rawUSDCData.contract });
    await component.ionViewWillEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.wad__title_and_image ion-button')).nativeElement.click();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      '/defi/new/insert-amount',
      'polygon_usdc',
      'invest',
    ]);
  });

  it('should reload transfers when refresher is triggered', fakeAsync(() => {
    const eventMock = { target: { complete: jasmine.createSpy('complete') } };
    const spy = spyOn(component, 'getTransfers').and.callThrough();
    component.ionViewWillEnter();
    tick();
    fixture.debugElement.query(By.css('ion-refresher')).triggerEventHandler('ionRefresh', eventMock);
    tick(1000);
    tick();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(eventMock.target.complete).toHaveBeenCalledTimes(1);
    expect(refreshTimeoutServiceSpy.lock).toHaveBeenCalledTimes(1);
    discardPeriodicTasks();
  }));

  it('should not reload transfers when refresher is not available', fakeAsync(() => {
    refreshTimeoutServiceSpy.isAvailable.and.returnValue(false);
    const eventMock = { target: { complete: jasmine.createSpy('complete') } };
    const spy = spyOn(component, 'getTransfers');
    tick();
    fixture.debugElement.query(By.css('ion-refresher')).triggerEventHandler('ionRefresh', eventMock);
    tick(1000);

    expect(spy).not.toHaveBeenCalled();
    expect(eventMock.target.complete).toHaveBeenCalledTimes(1);
    expect(refreshTimeoutServiceSpy.lock).not.toHaveBeenCalled();
  }));
});
