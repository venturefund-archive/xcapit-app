import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { BlockchainRepo } from '../shared-swaps/models/blockchain-repo/blockchain-repo';
import { DefaultBlockchains } from '../shared-swaps/models/blockchains/blockchains';
import { BlockchainsFactory } from '../shared-swaps/models/blockchains/factory/blockchains.factory';
import { rawBlockchainsData, rawPolygonData } from '../shared-swaps/models/fixtures/raw-blockchains-data';
import { SwapHomePage } from './swap-home.page';
import { DefaultTokens } from '../shared-swaps/models/tokens/tokens';
import { rawMATICData, rawTokensData, rawUSDCData } from '../shared-swaps/models/fixtures/raw-tokens-data';
import { TokenRepo } from '../shared-swaps/models/token-repo/token-repo';
import { IntersectedTokensFactory } from '../shared-swaps/models/intersected-tokens/factory/intersected-tokens.factory';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { WalletsFactory } from '../shared-swaps/models/wallets/factory/wallets.factory';
import { FakeWallet, SendTxsError } from '../shared-swaps/models/wallet/wallet';
import { OneInchFactory } from '../shared-swaps/models/one-inch/factory/one-inch.factory';
import { SwapTransactionsFactory } from '../shared-swaps/models/swap-transactions/factory/swap-transactions.factory';
import { FakeBlockchainTx } from '../shared-swaps/models/fakes/fake-blockchain-tx';
import { NullJSONSwapInfo } from '../shared-swaps/models/json-swap-info/json-swap-info';
import { rawSwapInfoData } from '../shared-swaps/models/fixtures/raw-one-inch-response-data';
import { LocalNotificationSchema } from '@capacitor/local-notifications';
import { LocalNotificationsService } from '../../notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { GasStationOfFactory } from '../shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { AmountOf } from '../shared-swaps/models/amount-of/amount-of';
import { DefaultToken } from '../shared-swaps/models/token/token';
import { PasswordErrorMsgs } from '../shared-swaps/models/password/password-error-msgs';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { WalletBalanceService } from '../../wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { OneInchBlockchainsOfFactory } from '../shared-swaps/models/one-inch-blockchains-of/factory/one-inch-blockchains-of';
import { OneInchBlockchainsOf } from '../shared-swaps/models/one-inch-blockchains-of/one-inch-blockchains-of';
import { DefaultSwapsUrls } from '../shared-swaps/routes/default-swaps-urls';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';
import { of } from 'rxjs';
import { IonicStorageService } from '../../../shared/services/ionic-storage/ionic-storage.service';
import { Password } from '../shared-swaps/models/password/password';
import { TxInProgressService } from '../shared-swaps/services/swap-in-progress/tx-in-progress.service';

describe('SwapHomePage', () => {
  let component: SwapHomePage;
  let fixture: ComponentFixture<SwapHomePage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SwapHomePage>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let oneInchBlockchainsOfFactorySpy: jasmine.SpyObj<OneInchBlockchainsOfFactory>;
  let intersectedTokensFactorySpy: jasmine.SpyObj<IntersectedTokensFactory>;
  let oneInchFactorySpy: jasmine.SpyObj<OneInchFactory>;
  let walletsFactorySpy: jasmine.SpyObj<any | WalletsFactory>;
  let swapTransactionsFactorySpy: jasmine.SpyObj<SwapTransactionsFactory>;
  let gasStationOfFactorySpy: jasmine.SpyObj<GasStationOfFactory>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let localNotificationsServiceSpy: jasmine.SpyObj<LocalNotificationsService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletBalanceSpy: jasmine.SpyObj<WalletBalanceService>;
  let dynamicPriceSpy: jasmine.SpyObj<DynamicPrice>;
  let dynamicPriceFactorySpy: jasmine.SpyObj<DynamicPriceFactory>;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;
  let activatedRouteSpy: any;
  let swapInProgressServiceSpy: jasmine.SpyObj<TxInProgressService>;
  const aPassword = new Password('aPassword');
  const aHashedPassword = 'iRJ1cT5x4V2jlpnVB0gp3bXdN4Uts3EAz4njSxGUNNqOGdxdWpjiTTWLOIAUp+6ketRUhjoRZBS8bpW5QnTnRA==';
  const testLocalNotificationOk: LocalNotificationSchema = {
    id: 1,
    title: 'swaps.sent_notification.swap_ok.title',
    body: 'swaps.sent_notification.swap_ok.body',
    actionTypeId: 'SWAP',
  };

  const localNotificationNotOkFor = (mode: string): LocalNotificationSchema => {
    return {
      id: 1,
      title: `swaps.sent_notification.${mode}.title`,
      body: `swaps.sent_notification.${mode}.body`,
      actionTypeId: 'SWAP',
    };
  };
  const rawBlockchain = rawPolygonData;
  const fromToken = rawUSDCData;
  const toToken = rawMATICData;
  const urlToSelectSwapToken = (selectTokenkey: string) => [
    'swaps/select-currency/blockchain',
    rawBlockchain.name,
    'from-token',
    fromToken.contract,
    'to-token',
    toToken.contract,
    'token-to-select',
    selectTokenkey,
    'from-token-amount',
    '1',
  ];
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

  const _setTokenAmountArrange = (fromTokenAmount: number) => {
    component.ionViewDidEnter();
    tick();
    fixture.detectChanges();
    component.form.patchValue({ fromTokenAmount: fromTokenAmount });
    tick(501);
    fixture.detectChanges();
  };

  const _setWalletToInvalidPassword = () => {
    walletsFactorySpy.create.and.returnValue({
      oneBy: () =>
        Promise.resolve(new FakeWallet(Promise.resolve(false), new Error(new PasswordErrorMsgs().invalid()))),
    });
  };

  beforeEach(waitForAsync(() => {
    fakeActivatedRoute = new FakeActivatedRoute(
      {
        blockchain: rawBlockchain.name,
        fromToken: fromToken.contract,
        toToken: toToken.contract,
      },
      { 'from-token-amount': '1' }
    );
    activatedRouteSpy = fakeActivatedRoute.createSpy();

    swapInProgressServiceSpy = jasmine.createSpyObj('SwapInProgressService', {
      startSwap: null,
      finishSwap: null,
    });

    walletBalanceSpy = jasmine.createSpyObj('WalletBalanceService', {
      balanceOf: Promise.resolve(10),
    });
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoin: rawUSDCData,
      getNativeTokenFromNetwork: rawMATICData,
    });
    dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(2) });
    dynamicPriceFactorySpy = jasmine.createSpyObj('DynamicPriceFactory', {
      new: dynamicPriceSpy,
    });
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });
    oneInchBlockchainsOfFactorySpy = jasmine.createSpyObj('OneInchBlockchainsOfFactory', {
      create: new OneInchBlockchainsOf(blockchains, ['1', '137']),
    });
    oneInchFactorySpy = jasmine.createSpyObj('OneInchFactory', {
      create: { swapInfo: () => Promise.resolve(rawSwapInfoData) },
    });
    fakeModalController = new FakeModalController({}, { data: 'aPassword' });
    modalControllerSpy = fakeModalController.createSpy();

    intersectedTokensFactorySpy = jasmine.createSpyObj('IntersectedTokensFactory', {
      create: new DefaultTokens(new TokenRepo(rawTokensData)),
    });

    walletsFactorySpy = jasmine.createSpyObj('WalletsFactory', {
      create: { oneBy: () => Promise.resolve(new FakeWallet()) },
    });

    swapTransactionsFactorySpy = jasmine.createSpyObj('SwapTransactionsFactory', {
      create: { blockchainTxs: () => [new FakeBlockchainTx()] },
    });

    gasStationOfFactorySpy = jasmine.createSpyObj('GasStationOfFactory', {
      create: {
        price: () => ({ fast: () => Promise.resolve(new AmountOf('100000', new DefaultToken(rawMATICData))) }),
      },
    });

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    localNotificationsServiceSpy = jasmine.createSpyObj('LocalNotificationsService', {
      send: Promise.resolve(),
      registerActionTypes: Promise.resolve(),
      addListener: (callback: CallableFunction) => {
        callback();
      },
    });
    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showErrorToast: Promise.resolve(),
      showWarningToast: Promise.resolve(),
    });
    storageSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
      remove: Promise.resolve(),
      get: Promise.resolve(true),
    });

    TestBed.configureTestingModule({
      declarations: [SwapHomePage, FormattedAmountPipe, FakeTrackClickDirective],
      imports: [
        TranslateModule.forRoot(),
        IonicModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: OneInchBlockchainsOfFactory, useValue: oneInchBlockchainsOfFactorySpy },
        { provide: IntersectedTokensFactory, useValue: intersectedTokensFactorySpy },
        { provide: OneInchFactory, useValue: oneInchFactorySpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: WalletsFactory, useValue: walletsFactorySpy },
        { provide: GasStationOfFactory, useValue: gasStationOfFactorySpy },
        { provide: SwapTransactionsFactory, useValue: swapTransactionsFactorySpy },
        { provide: LocalNotificationsService, useValue: localNotificationsServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: WalletBalanceService, useValue: walletBalanceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: DynamicPriceFactory, useValue: dynamicPriceFactorySpy },
        { provide: IonicStorageService, useValue: storageSpy },
        { provide: TxInProgressService, useValue: swapInProgressServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SwapHomePage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track screenview event on init', () => {
    component.ionViewDidEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should call appTrackEvent on trackService when swap button is clicked', () => {
    spyOn(component, 'swapThem');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_swap_confirm');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should enable button on valid value in from token amount input', fakeAsync(() => {
    component.ionViewDidEnter();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_swap_confirm"]'));
    tick(3000);
    fixture.detectChanges();
    expect(component.form.valid).toBeTrue();
    expect(buttonEl.attributes['ng-reflect-disabled']).toEqual('false');
    discardPeriodicTasks();
  }));

  it('should disable button on invalid value in from token amount input', async () => {
    fakeActivatedRoute.modifySnapshotParams(
      {
        blockchain: rawBlockchain.name,
        fromToken: fromToken.contract,
        toToken: toToken.contract,
      },
      { 'from-token-amount': '0' }
    );
    await component.ionViewDidEnter();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_swap_confirm"]'));

    expect(component.form.valid).toBeFalse();
    expect(buttonEl.attributes['ng-reflect-disabled']).toEqual('true');
  });

  it('should show null swap info on invalid from token amount value', fakeAsync(() => {
    _setTokenAmountArrange(0);

    expect(component.tplSwapInfo).toEqual(new NullJSONSwapInfo().value());
  }));

  it('should show swap fee info with 0 value on invalid from token amount value', fakeAsync(() => {
    _setTokenAmountArrange(0);

    expect(component.tplFee.value).toEqual(0);
    expect(component.tplFee.token).toEqual(rawBlockchain.nativeToken.value);
  }));

  it('should show swap fee info with value greater than 0 on valid from token amount value', fakeAsync(() => {
    _setTokenAmountArrange(1);

    expect(component.tplFee.value).toBeGreaterThan(0);
    expect(component.tplFee.token).toEqual(rawBlockchain.nativeToken.value);
  }));

  it('should show warning toast and disable amount input if fromToken and toToken equals each other', async () => {
    fakeActivatedRoute.modifySnapshotParams({
      blockchain: rawBlockchain.name,
      fromToken: rawUSDCData.contract,
      toToken: rawUSDCData.contract,
    });

    await component.ionViewDidEnter();
    fixture.detectChanges();

    expect(toastServiceSpy.showWarningToast).toHaveBeenCalledTimes(1);
    expect(component.sameTokens).toBeTrue();
  });

  it('should show and render available amount properly', async () => {
    fakeActivatedRoute.modifySnapshotParams({
      blockchain: rawBlockchain.name,
      fromToken: rawMATICData.contract,
      toToken: rawUSDCData.contract,
    });
    apiWalletServiceSpy.getCoin.and.returnValue(rawMATICData);

    await component.ionViewDidEnter();
    fixture.detectChanges();

    const availableEl = fixture.debugElement.query(By.css('.sw__swap-card__from__detail__available ion-text '));
    expect(apiWalletServiceSpy.getCoin).toHaveBeenCalledTimes(1);
    expect(walletBalanceSpy.balanceOf).toHaveBeenCalledTimes(1);
    expect(availableEl.nativeElement.innerHTML).toContain('swaps.home.available 10');
  });

  it('should unsubscribe when leave', () => {
    const nextSpy = spyOn(component.destroy$, 'next');
    const completeSpy = spyOn(component.destroy$, 'complete');

    component.ionViewWillLeave();

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should set native token balance to pass to fee component', async () => {
    fakeActivatedRoute.modifySnapshotParams({
      blockchain: rawBlockchain.name,
      fromToken: rawUSDCData.contract,
      toToken: rawMATICData.contract,
    });
    apiWalletServiceSpy.getCoin.and.returnValue(rawUSDCData);

    await component.ionViewDidEnter();
    fixture.detectChanges();

    expect(apiWalletServiceSpy.getCoin).toHaveBeenCalledTimes(1);
    expect(apiWalletServiceSpy.getNativeTokenFromNetwork).toHaveBeenCalledTimes(1);
    expect(walletBalanceSpy.balanceOf).toHaveBeenCalledTimes(2);
  });

  it('should show swap info on valid from token amount value', fakeAsync(() => {
    _setTokenAmountArrange(1);

    expect(component.tplSwapInfo.toTokenAmount).toBeGreaterThan(0);
  }));

  it('set blockchain from path param', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();

    expect(component.tplBlockchain.name).toEqual(rawBlockchain.name);
    expect(component.tplBlockchain.id).toEqual(rawBlockchain.id);
  });

  it('navigate on from token click', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    const fromTokenEl = fixture.debugElement.query(By.css('.sw__swap-card__from__detail__token>app-coin-selector'));

    fromTokenEl.triggerEventHandler('changeCurrency', null);

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(urlToSelectSwapToken('fromToken'));
  });

  it('navigate on to token click', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    const toTokenEl = fixture.debugElement.query(By.css('.sw__swap-card__to__detail__token>app-coin-selector'));

    toTokenEl.triggerEventHandler('changeCurrency', null);

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(urlToSelectSwapToken('toToken'));
  });

  it('password modal and success modal open on click swap button and password is valid', fakeAsync(() => {
    storageSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve(aHashedPassword));
    _setTokenAmountArrange(1);

    component.swapThem();

    tick(2);

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
  }));

  it('password is valid, start swap for save in ionic storage service', fakeAsync(() => {
    storageSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve(aHashedPassword));
    _setTokenAmountArrange(1);
    component.swapThem();

    tick(2);

    expect(swapInProgressServiceSpy.startSwap).toHaveBeenCalledTimes(1);
    expect(swapInProgressServiceSpy.finishSwap).toHaveBeenCalledTimes(1);
  }));

  it('password is invalid, it not start swap', fakeAsync(() => {
    _setWalletToInvalidPassword();
    _setTokenAmountArrange(1);
    component.swapThem();

    tick(2);

    expect(swapInProgressServiceSpy.startSwap).toHaveBeenCalledTimes(0);
  }));

  it('password modal open on click swap button and password is invalid', fakeAsync(() => {
    _setWalletToInvalidPassword();
    _setTokenAmountArrange(1);

    component.swapThem();
    tick(2);

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
  }));

  it('should send success notification when swap is ok', fakeAsync(() => {
    storageSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve(aHashedPassword));
    _setTokenAmountArrange(1);
    component.swapThem();
    tick(2);

    expect(localNotificationsServiceSpy.send).toHaveBeenCalledOnceWith([testLocalNotificationOk]);
  }));

  it('should send error notification when swap is not ok', fakeAsync(() => {
    storageSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve(aHashedPassword));
    walletsFactorySpy.create.and.returnValue({
      oneBy: () =>
        Promise.resolve(new FakeWallet(Promise.resolve(false), new SendTxsError('a random error', 'www.1inch.com'))),
    });
    _setTokenAmountArrange(1);
    fixture.detectChanges();

    component.swapThem();
    tick(1000);

    expect(localNotificationsServiceSpy.send).toHaveBeenCalledOnceWith([localNotificationNotOkFor('swap_not_ok')]);
  }));

  it('should send error blockchain notification when swap is not ok', fakeAsync(() => {
    storageSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve(aHashedPassword));
    walletsFactorySpy.create.and.returnValue({
      oneBy: () =>
        Promise.resolve(
          new FakeWallet(Promise.resolve(false), new SendTxsError('a random error', 'www.blockchain.com'))
        ),
    });
    _setTokenAmountArrange(1);
    fixture.detectChanges();

    component.swapThem();
    tick(1000);

    expect(localNotificationsServiceSpy.send).toHaveBeenCalledOnceWith([
      localNotificationNotOkFor('swap_not_ok_blockchain'),
    ]);
  }));

  it('should dont send notificaion on invalid password', fakeAsync(() => {
    _setWalletToInvalidPassword();
    _setTokenAmountArrange(1);
    fixture.detectChanges();

    component.swapThem();
    tick(2);

    expect(localNotificationsServiceSpy.send).toHaveBeenCalledTimes(0);
  }));

  it('should do nothing on close modal password/empty password', fakeAsync(() => {
    fakeModalController.modifyReturns({}, { data: '' });
    _setTokenAmountArrange(1);
    fixture.detectChanges();

    component.swapThem();
    tick(2);

    expect(localNotificationsServiceSpy.send).toHaveBeenCalledTimes(0);
  }));

  it('should change selected network on event emited', async () => {
    const blockchainName = 'ERC20';
    await component.ionViewDidEnter();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('app-network-select-card')).triggerEventHandler('networkChanged', blockchainName);

    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(
      new DefaultSwapsUrls().homeByBlockchain(blockchainName),
      { replaceUrl: true, animated: false }
    );
  });

  it('should set max amount from swap', async () => {
    walletBalanceSpy.balanceOf.and.returnValues(Promise.resolve(10), Promise.resolve(0));
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await component.setMaxAmount();

    expect(component.form.controls.fromTokenAmount.value).toEqual(10);
  });

  it('should set max amount from native token swap', async () => {
    fakeActivatedRoute.modifySnapshotParams({
      blockchain: rawBlockchain.name,
      fromToken: rawMATICData.contract,
      toToken: rawUSDCData.contract,
    });
    walletBalanceSpy.balanceOf.and.returnValues(Promise.resolve(10), Promise.resolve(0));
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await component.setMaxAmount();

    expect(component.form.controls.fromTokenAmount.value).toEqual(9.99999997132675);
  });

  it('should render correct properly and enabled button when the balance is available', fakeAsync(() => {
    _setTokenAmountArrange(1);
    const div = fixture.debugElement.query(By.css('div.sw__swap-card__from__detail__available'));
    fixture.detectChanges();

    expect(div).toBeTruthy();
    expect(component.disabledBtn).toBeFalsy();
    expect(component.insufficientBalance).toBeFalsy();
  }));

  it('should render correct properly and disabled button when the balance is insufficient', fakeAsync(() => {
    _setTokenAmountArrange(11);
    const div = fixture.debugElement.query(By.css('div.sw__swap-card__from__detail__insufficient'));
    fixture.detectChanges();

    expect(div).toBeTruthy();
    expect(component.disabledBtn).toBeTruthy();
    expect(component.insufficientBalance).toBeTruthy();
  }));

  it('should show alert when insuficient funds for amount', fakeAsync(() => {
    const feeModal = spyOn(component, 'showInsufficientBalanceFeeModal');
    const balanceModal = spyOn(component, 'showInsufficientBalanceModal');

    _setTokenAmountArrange(15);

    expect(balanceModal).toHaveBeenCalledTimes(1);
    expect(feeModal).not.toHaveBeenCalled();
  }));

  it('should show alert when insuficient funds for fee', fakeAsync(() => {
    const feeModal = spyOn(component, 'showInsufficientBalanceFeeModal');
    const balanceModal = spyOn(component, 'showInsufficientBalanceModal');
    walletBalanceSpy.balanceOf.and.returnValues(
      Promise.resolve(10),
      Promise.resolve(0),
      Promise.resolve(10),
      Promise.resolve(0)
    );
    fixture.detectChanges();
    _setTokenAmountArrange(10);

    expect(feeModal).toHaveBeenCalledTimes(1);
    expect(balanceModal).not.toHaveBeenCalled();
  }));

  it('should set value on fromTokenAmount input on init', fakeAsync(() => {
    component.ionViewDidEnter();
    tick();
    fixture.detectChanges();
    expect(component.form.value.fromTokenAmount).toBe('1');
    discardPeriodicTasks();
  }));
});
