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
import { FiatRampsService } from '../../fiat-ramps/shared-ramps/services/fiat-ramps.service';
import { rawPendingOperationData } from '../../fiat-ramps/shared-ramps/fixtures/raw-operation-data';
import { ModalFactoryInjectable } from '../../../shared/models/modal/injectable/modal-factory.injectable';
import { FakeModal } from '../../../shared/models/modal/fake/fake-modal';
import { KriptonStorageService } from '../../fiat-ramps/shared-ramps/services/kripton-storage/kripton-storage.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { ActivatedRoute } from '@angular/router';
import { FakeModalFactory } from '../../../shared/models/modal/factory/fake/fake-modal-factory';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { NullNotificationsService } from '../../notifications/shared-notifications/services/null-notifications/null-notifications.service';
import { FakeLenders } from 'src/app/shared/models/lenders/fake/fake-lenders';
import { FakeLender } from 'src/app/shared/models/lender/fake/fake-lender';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeAppStorage } from 'src/app/shared/services/app-storage/app-storage.service';
import { ActiveLenderInjectable } from 'src/app/shared/models/active-lender/injectable/active-lender.injectable';

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
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let modalFactoryInjectableSpy: jasmine.SpyObj<ModalFactoryInjectable>;
  let kriptonStorageServiceSpy: jasmine.SpyObj<KriptonStorageService>;
  let fakeModal: FakeModal;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;
  let activeLenderInjectableSpy: jasmine.SpyObj<ActiveLenderInjectable>;
  let fakeLenders: FakeLenders;

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

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsServiceSpy', {
      getUserOperations: of([rawPendingOperationData]),
    });

    fakeModal = new FakeModal();
    modalFactoryInjectableSpy = jasmine.createSpyObj('ModalFactoryInjectable', {
      create: new FakeModalFactory(fakeModal),
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

    warrantyServiceSpy = jasmine.createSpyObj('WarrantyService', { verifyWarranty: of({ amount: 0 }) });

    fakeModalController = new FakeModalController(null, { role: 'confirm' });
    modalControllerSpy = fakeModalController.createSpy();
    kriptonStorageServiceSpy = jasmine.createSpyObj('KriptonStorageService', {
      get: Promise.resolve(),
    });
    kriptonStorageServiceSpy.get.withArgs('email').and.resolveTo('test@test.com');
    kriptonStorageServiceSpy.get.withArgs('access_token').and.resolveTo('test');

    fakeActivatedRoute = new FakeActivatedRoute();
    activatedRouteSpy = fakeActivatedRoute.createSpy();

    notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', {
      getInstance: new NullNotificationsService(),
    });

    activeLenderInjectableSpy = jasmine.createSpyObj('ActiveLenderInjectable', {
      create: { value: () => Promise.resolve(new FakeLender())},
    });

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
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: ModalFactoryInjectable, useValue: modalFactoryInjectableSpy },
        { provide: KriptonStorageService, useValue: kriptonStorageServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
        { provide: ActiveLenderInjectable, useValue: activeLenderInjectableSpy },
        { provide: IonicStorageService, useValue: new FakeAppStorage({ active_lender: 'name' }) },
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

  it('should show pending crypto modal if balance is zero and there is a pending operation', async () => {
    new SpyProperty(tokenDetailSpy, 'balance').value().and.returnValue(0);
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(fakeModal.calls).toEqual(1);
  });

  it('should show has crypto modal if balance is above zero and there is a pending operation', async () => {
    new SpyProperty(tokenDetailSpy, 'balance').value().and.returnValue(100);
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(fakeModal.calls).toEqual(1);
  });

  it('should show warranty modal if balance is above zero and there is not a pending operation', async () => {
    new SpyProperty(tokenDetailSpy, 'balance').value().and.returnValue(100);
    fiatRampsServiceSpy.getUserOperations.and.returnValue(of([]));
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(fakeModal.calls).toEqual(1);
  });

  it('should show buy or deposit modal if balance is zero and there is not a pending operation', async () => {
    new SpyProperty(tokenDetailSpy, 'balance').value().and.returnValue(0);
    fiatRampsServiceSpy.getUserOperations.and.returnValue(of([]));
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(fakeModal.calls).toEqual(1);
  });

  it('should show buy or deposit modal if balance is zero and user is not logged in kripton', async () => {
    new SpyProperty(tokenDetailSpy, 'balance').value().and.returnValue(0);
    kriptonStorageServiceSpy.get.withArgs('email').and.resolveTo();
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(fakeModal.calls).toEqual(1);
  });

  it('should enable warranty button card if balance is above zero', async () => {
    new SpyProperty(tokenDetailSpy, 'balance').value().and.returnValue(100);
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('ion-button[name="ux_nav_go_to_warrant"]'));
    expect(el.nativeElement.disabled).toBeFalse();
  });

  it('should enable warranty button card if balance is zero', async () => {
    new SpyProperty(tokenDetailSpy, 'balance').value().and.returnValue(0);
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('ion-button[name="ux_nav_go_to_warrant"]'));
    expect(el.nativeElement.disabled).toBeTrue();
  });

  it('should open warranty modal if card button was clicked', async () => {
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="ux_nav_go_to_warrant"]')).nativeElement.click();
    fixture.detectChanges();

    expect(fakeModal.calls).toEqual(2);
  });

  it('should open warranty modal if subheader button was clicked', async () => {
    await component.ionViewWillEnter();
    fixture.debugElement
      .query(By.css('app-simplified-wallet-subheader-buttons'))
      .triggerEventHandler('openWarrantyModal');
    fixture.detectChanges();

    expect(fakeModal.calls).toEqual(2);
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

  it('should call notifications service getInstance on ionViewWillEnter', async () => {
    await component.ionViewWillEnter();

    expect(notificationsServiceSpy.getInstance).toHaveBeenCalledTimes(1);
  });
});
