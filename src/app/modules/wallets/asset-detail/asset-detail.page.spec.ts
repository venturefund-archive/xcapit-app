import { HttpClientTestingModule } from '@angular/common/http/testing';
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

describe('AssetDetailPage', () => {
  let component: AssetDetailPage;
  let fixture: ComponentFixture<AssetDetailPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let walletTransactionsServiceSpy: jasmine.SpyObj<WalletTransactionsService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeNavController: FakeNavController;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let coinsSpy: jasmine.SpyObj<Coin>[];

  beforeEach(
    waitForAsync(() => {
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
      ];
      fakeActivatedRoute = new FakeActivatedRoute({ currency: 'ETH' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getPrices: of({ prices: { ETH: 3000 } }),
        getCoins: coinsSpy,
      });
      walletServiceSpy = jasmine.createSpyObj(
        'WalletService',
        { balanceOf: Promise.resolve('20') },
        { addresses: { ERC20: 'testAddress' } }
      );
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
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(AssetDetailPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get currency on view will enter', async () => {
    expect(component.currency).toBeFalsy();
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.currency).toEqual(coinsSpy[0]);
    expect(component.enabledToBuy).toBeTrue();
  });

  it('should disable purchase when token is not enabled to buy among all providers', async () => {
    fakeActivatedRoute.modifySnapshotParams({ currency: 'AVAX' });
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.enabledToBuy).toBeFalse();
  });

  it('should get transfers on view will enter', async () => {
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    expect(component.transfers[0].symbol).toBe('ETH');
    expect(component.transfers[0].type).toBe('OUT');
    expect(component.transfers[0].amount).toBe(0.01);
    expect(component.transfers[1].symbol).toBe('ETH');
    expect(component.transfers[1].type).toBe('IN');
    expect(component.transfers[1].amount).toBe(0.01);
    const transfersEl = fixture.debugElement.query(By.css('app-wallet-transaction-card'));
    expect(transfersEl).not.toBe(null);
  });

  it('should get prices and balances on view will enter', async () => {
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const [amountEl, quoteAmountEl] = fixture.debugElement.queryAll(By.css('.wad__available__amounts ion-text'));
    expect(amountEl.nativeElement.innerHTML).toContain(20);
    expect(amountEl.nativeElement.innerHTML).toContain('ETH');
    expect(quoteAmountEl.nativeElement.innerHTML).toContain('USD');
    expect(quoteAmountEl.nativeElement.innerHTML).toContain('60000 USD');
  });

  it('should get prices and balances on view will enter without prices', async () => {
    apiWalletServiceSpy.getPrices.and.returnValues(of({ prices: {} }));
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const [amountEl, quoteAmountEl] = fixture.debugElement.queryAll(By.css('.wad__available__amounts ion-text'));
    expect(amountEl.nativeElement.innerHTML).toContain(20);
    expect(amountEl.nativeElement.innerHTML).toContain('ETH');
    expect(quoteAmountEl).toBe(undefined);
  });
});
