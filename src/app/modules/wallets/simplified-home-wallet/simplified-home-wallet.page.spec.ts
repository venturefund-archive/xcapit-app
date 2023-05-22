import { IonicModule, ModalController } from '@ionic/angular';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SimplifiedHomeWalletPage } from './simplified-home-wallet.page';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { of } from 'rxjs/internal/observable/of';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { rawBlockchainsData } from '../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { BlockchainRepo } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { DefaultBlockchains } from '../../swaps/shared-swaps/models/blockchains/blockchains';
import { TransfersFactory } from '../shared-wallets/models/transfers/factory/transfers.factory';
import { rawTransfer } from '../shared-wallets/fixtures/covalent-transfers.fixture';
import { Transfers } from '../shared-wallets/models/transfers/transfers';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { WalletsFactory } from '../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { FakeWallet } from '../../swaps/shared-swaps/models/wallet/fake/fake-wallet';
import { CovalentBalancesInjectable } from '../shared-wallets/models/balances/covalent-balances/covalent-balances.injectable';
import { TokenPricesInjectable } from '../shared-wallets/models/prices/token-prices/token-prices.injectable';
import { TokenDetailInjectable } from '../shared-wallets/models/token-detail/injectable/token-detail.injectable';
import { TokenDetail } from '../shared-wallets/models/token-detail/token-detail';
import { FakePrices } from '../shared-wallets/models/prices/fake-prices/fake-prices';
import { FakeBalances } from '../shared-wallets/models/balances/fake-balances/fake-balances';
import { WarrantiesService } from '../../warranties/shared-warranties/services/warranties.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { rawTokensData, rawUSDCData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { SpyProperty } from 'src/testing/spy-property.spec';
import { By } from '@angular/platform-browser';
import { HideTextPipe } from 'src/app/shared/pipes/hide-text/hide-text.pipe';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';

describe('SimplifiedHomeWalletPage', () => {
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));
  let component: SimplifiedHomeWalletPage;
  let fixture: ComponentFixture<SimplifiedHomeWalletPage>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let transfersFactorySpy: jasmine.SpyObj<TransfersFactory>;
  let transfersSpy: jasmine.SpyObj<Transfers>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletsFactorySpy: jasmine.SpyObj<WalletsFactory>;
  let covalentBalancesInjectableSpy: jasmine.SpyObj<CovalentBalancesInjectable>;
  let tokenPricesInjectableSpy: jasmine.SpyObj<TokenPricesInjectable>;
  let tokenDetailInjectableSpy: jasmine.SpyObj<TokenDetailInjectable>;
  let tokenDetailSpy: jasmine.SpyObj<TokenDetail>;
  let warrantyServiceSpy: jasmine.SpyObj<WarrantiesService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    localStorageServiceSpy = jasmine.createSpyObj(
      'LocalStorageService',
      {
        toggleHideFunds: undefined,
      },
      { hideFunds: of(false) }
    );

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    transfersSpy = jasmine.createSpyObj('Transfers', {
      cached: rawTransfer,
      all: rawTransfer,
    });

    transfersFactorySpy = jasmine.createSpyObj('TransfersFactory', {
      create: transfersSpy,
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: rawTokensData,
      getCoin: rawUSDCData,
    });

    walletsFactorySpy = jasmine.createSpyObj('WalletsFactory', {
      create: { oneBy: () => Promise.resolve(new FakeWallet(Promise.resolve(false), null, '0xTestWallet')) },
    });

    tokenPricesInjectableSpy = jasmine.createSpyObj('TokenPricesInjectable', {
      create: new FakePrices(),
    });

    covalentBalancesInjectableSpy = jasmine.createSpyObj('CovalentBalancesInjectable', {
      create: new FakeBalances({ balance: 20 }),
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

    warrantyServiceSpy = jasmine.createSpyObj('WarrantyService', { verifyWarranty: of({ amount: 10 }) });

    fakeModalController = new FakeModalController(null, { role: 'confirm' });
    modalControllerSpy = fakeModalController.createSpy();

    TestBed.configureTestingModule({
      declarations: [SimplifiedHomeWalletPage, FakeTrackClickDirective, HideTextPipe, FormattedAmountPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: TransfersFactory, useValue: transfersFactorySpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: WalletsFactory, useValue: walletsFactorySpy },
        { provide: CovalentBalancesInjectable, useValue: covalentBalancesInjectableSpy },
        { provide: TokenPricesInjectable, useValue: tokenPricesInjectableSpy },
        { provide: TokenDetailInjectable, useValue: tokenDetailInjectableSpy },
        { provide: WarrantiesService, useValue: warrantyServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SimplifiedHomeWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize page', async () => {
    await component.ionViewWillEnter();
    expect(blockchainsFactorySpy.create).toHaveBeenCalledTimes(1);
    expect(apiWalletServiceSpy.getCoin).toHaveBeenCalledOnceWith('USDC', 'MATIC');
    expect(apiWalletServiceSpy.getCoins).toHaveBeenCalledTimes(1);
    expect(walletsFactorySpy.create).toHaveBeenCalledTimes(1);
    expect(warrantyServiceSpy.verifyWarranty).toHaveBeenCalledOnceWith({ wallet: '0xTestWallet' });
    expect(tokenDetailInjectableSpy.create).toHaveBeenCalledTimes(1);
    expect(covalentBalancesInjectableSpy.create).toHaveBeenCalledTimes(1);
    expect(tokenDetailInjectableSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should open insufficient balance modal and disable warranty button card if balance is zero', async () => {
    new SpyProperty(tokenDetailSpy, 'balance').value().and.returnValue(0);
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('ion-button[name="ux_nav_go_to_warranty"]'));
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(el.nativeElement.disabled).toBeTruthy();
  });

  it('should open warranty modal if card button was clicked', async () => {
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_nav_go_to_warranty"]')).nativeElement.click();
    fixture.detectChanges();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should open warranty modal if subheader button was clicked', async () => {
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('app-simplified-wallet-subheader-buttons'))
      .triggerEventHandler('openWarrantyModal');
    fixture.detectChanges();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show empty state on transactions if there is not transactions', async () => {
    transfersSpy.all.and.resolveTo([]);
    transfersSpy.cached.and.resolveTo([]);
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    const divEl = fixture.debugElement.query(By.css('div.swt__transaction__wallet-transaction-card__empty'));
    fixture.detectChanges();

    expect(divEl).toBeTruthy();
  });
});
