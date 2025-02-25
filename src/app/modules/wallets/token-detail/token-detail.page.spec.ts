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
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { TransfersFactory } from '../shared-wallets/models/transfers/factory/transfers.factory';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { CovalentBalancesInjectable } from '../shared-wallets/models/balances/covalent-balances/covalent-balances.injectable';
import { TokenPricesInjectable } from '../shared-wallets/models/prices/token-prices/token-prices.injectable';
import { rawETHData, rawSAMOData, rawTokensData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import {
  rawBlockchainsData,
  rawEthereumData,
  rawSolanaData,
} from '../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { DefaultBlockchains } from '../../swaps/shared-swaps/models/blockchains/default/default-blockchains';
import { BlockchainRepo } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { FakeBalances } from '../shared-wallets/models/balances/fake-balances/fake-balances';
import { FakePrices } from '../shared-wallets/models/prices/fake-prices/fake-prices';
import { TokenDetailInjectable } from '../shared-wallets/models/token-detail/injectable/token-detail.injectable';
import { TokenDetail } from '../shared-wallets/models/token-detail/token-detail';
import { SpyProperty } from 'src/testing/spy-property.spec';
import { RefreshTimeoutService } from 'src/app/shared/services/refresh-timeout/refresh-timeout.service';
import { of } from 'rxjs';
import { Transfers } from '../shared-wallets/models/transfers/transfers';
import { FiatRampsService } from '../../fiat-ramps/shared-ramps/services/fiat-ramps.service';
import { FakeWallet } from '../shared-wallets/models/wallet/fake/fake-wallet';
import { WalletsFactory } from '../shared-wallets/models/wallets/factory/wallets.factory';

describe('TokenDetailPage', () => {
  let component: TokenDetailPage;
  let fixture: ComponentFixture<TokenDetailPage>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let transfersFactorySpy: jasmine.SpyObj<TransfersFactory>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let walletsFactorySpy: jasmine.SpyObj<WalletsFactory>;
  let covalentBalancesInjectableSpy: jasmine.SpyObj<CovalentBalancesInjectable>;
  let tokenPricesInjectableSpy: jasmine.SpyObj<TokenPricesInjectable>;
  let tokenDetailInjectableSpy: jasmine.SpyObj<TokenDetailInjectable>;
  let tokenDetailSpy: jasmine.SpyObj<TokenDetail>;
  let refreshTimeoutServiceSpy: jasmine.SpyObj<RefreshTimeoutService>;
  let transfersSpy: jasmine.SpyObj<Transfers>;
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));
  const availableKriptonCurrencies = [
    {
      network: 'MATIC',
      currencies: ['USDC', 'MATIC', 'DAI'],
    },
  ];
  const rawTransfer = {
    block_height: 31071581,
    block_signed_at: '2023-01-17T16:50:57Z',
    fees_paid: '30800000301000',
    from_address: '0x925f1b4d8092bd94608b1f680b87f87f0bd737dc',
    from_address_label: null,
    gas_offered: 21000,
    gas_price: 1466666681,
    gas_quote: null,
    gas_quote_rate: null,
    gas_spent: 21000,
    successful: true,
    to_address: '0xa895d3221076a464b45d1cdb30cdc2691497e0c4',
    to_address_label: null,
    tx_hash: '0x0e1029197d9874a36011a11bae091714dcedf7464475906ffa2e54a39411f8a2',
    tx_offset: 8,
    value: '200000000000000',
    value_quote: null,
  };

  beforeEach(waitForAsync(() => {
    tokenPricesInjectableSpy = jasmine.createSpyObj('TokenPricesInjectable', {
      create: new FakePrices(),
    });
    covalentBalancesInjectableSpy = jasmine.createSpyObj('CovalentBalancesInjectable', { create: new FakeBalances() });
    fakeActivatedRoute = new FakeActivatedRoute({ blockchain: rawEthereumData.name, token: rawETHData.contract });
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: rawTokensData,
    });

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getKriptonAvailableCurrencies: of(availableKriptonCurrencies),
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    providersSpy = jasmine.createSpyObj('Providers', {
      all: rawProvidersData,
    });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: providersSpy,
    });

    transfersSpy = jasmine.createSpyObj('Transfers', {
      cached: rawTransfer,
      all: rawTransfer,
    });

    transfersFactorySpy = jasmine.createSpyObj('TransfersFactory', {
      create: transfersSpy,
    });

    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', {
      getObject: [{ test: 'test' }],
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
        { provide: RemoteConfigService, useValue: remoteConfigSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: TransfersFactory, useValue: transfersFactorySpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: WalletsFactory, useValue: walletsFactorySpy },
        { provide: CovalentBalancesInjectable, useValue: covalentBalancesInjectableSpy },
        { provide: TokenPricesInjectable, useValue: tokenPricesInjectableSpy },
        { provide: TokenDetailInjectable, useValue: tokenDetailInjectableSpy },
        { provide: RefreshTimeoutService, useValue: refreshTimeoutServiceSpy },
        { provide: Transfers, useValue: transfersSpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
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
    await fixture.whenRenderingDone();
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
