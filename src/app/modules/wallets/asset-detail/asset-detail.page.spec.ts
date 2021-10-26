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
  let activatedRouteMock: any;
  let fakeNavController: FakeNavController;
  beforeEach(
    waitForAsync(() => {
      activatedRouteMock = { snapshot: { paramMap: { get: () => 'ETH' } } };
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { getPrices: of({ prices: { ETH: 3000 } }) });
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

      TestBed.configureTestingModule({
        declarations: [AssetDetailPage],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule.forRoot(), RouterTestingModule],
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
      component.coins = [nativeAsset];
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
    expect(component.currency).toEqual(nativeAsset);
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
    const amountEl = fixture.debugElement.query(By.css('.wad__asset_amount__original ion-text'));
    expect(amountEl.nativeElement.innerHTML).toContain(20);
    expect(amountEl.nativeElement.innerHTML).toContain('ETH');
    const quoteAmountEl = fixture.debugElement.query(By.css('.wad__asset_amount__usd ion-text'));
    expect(quoteAmountEl.nativeElement.innerHTML).toContain('USD');
    expect(quoteAmountEl.nativeElement.innerHTML).toContain('60,000.00 USD');
  });

  it('should get prices and balances on view will enter without prices', async () => {
    apiWalletServiceSpy.getPrices.and.returnValues(of({ prices: {} }));
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const amountEl = fixture.debugElement.query(By.css('.wad__asset_amount__original ion-text'));
    expect(amountEl.nativeElement.innerHTML).toContain(20);
    expect(amountEl.nativeElement.innerHTML).toContain('ETH');
    const quoteAmountEl = fixture.debugElement.query(By.css('.wad__asset_amount__usd ion-text'));
    expect(quoteAmountEl).toBe(null);
  });
});
