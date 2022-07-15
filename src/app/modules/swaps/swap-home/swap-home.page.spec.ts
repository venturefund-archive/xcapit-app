import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
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
import { Blockchains } from '../shared-swaps/models/blockchains/blockchains';
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
import { FakeWallet } from '../shared-swaps/models/wallet/wallet';
import { OneInchFactory } from '../shared-swaps/models/one-inch/factory/one-inch.factory';
import { SwapTransactionsFactory } from '../shared-swaps/models/swap-transactions/factory/swap-transactions.factory';
import { FakeBlockchainTx } from '../shared-swaps/models/fakes/fake-blockchain-tx';
import { NullJSONSwapInfo } from '../shared-swaps/models/json-swap-info/json-swap-info';
import { rawSwapInfoData } from '../shared-swaps/models/fixtures/raw-one-inch-response-data';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { GasStationOfFactory } from '../shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { AmountOf } from '../shared-swaps/models/amount-of/amount-of';
import { DefaultToken } from '../shared-swaps/models/token/token';


describe('SwapHomePage', () => {

  let component: SwapHomePage;
  let fixture: ComponentFixture<SwapHomePage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SwapHomePage>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let intersectedTokensFactorySpy: jasmine.SpyObj<IntersectedTokensFactory>;
  let oneInchFactorySpy: jasmine.SpyObj<OneInchFactory>;
  let walletsFactorySpy: jasmine.SpyObj<any | WalletsFactory>;
  let swapTransactionsFactorySpy: jasmine.SpyObj<SwapTransactionsFactory>;
  let gasStationOfFactorySpy: jasmine.SpyObj<GasStationOfFactory>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

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
  ];

  const _setTokenAmountArrange = (fromTokenAmount: number) => {
    component.ionViewDidEnter();
    tick();
    fixture.detectChanges();
    component.form.patchValue({ fromTokenAmount: fromTokenAmount });
    tick(501);
    fixture.detectChanges();
  }

  beforeEach(
    waitForAsync(() => {
      fakeActivatedRoute = new FakeActivatedRoute({
        blockchain: rawBlockchain.name,
        fromToken: fromToken.contract,
        toToken: toToken.contract,
      });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
        create: new Blockchains(new BlockchainRepo(rawBlockchainsData)),
      });
      oneInchFactorySpy = jasmine.createSpyObj('OneInchFactory', {
        create: { swapInfo: () => Promise.resolve(rawSwapInfoData) },
      });
      fakeModalController = new FakeModalController({}, { data: 'aPasswordString' });
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
        create: { price: () => ({ fast: () => Promise.resolve(new AmountOf('1', new DefaultToken(rawMATICData))) }) }
      });

      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
        trackEvent: Promise.resolve(true),
      });

      toastServiceSpy = jasmine.createSpyObj('ToastService', {
        showErrorToast: Promise.resolve(),
        showWarningToast: Promise.resolve(),
      });

      TestBed.configureTestingModule({
        declarations: [SwapHomePage, FormattedAmountPipe, FakeTrackClickDirective,],
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
          { provide: IntersectedTokensFactory, useValue: intersectedTokensFactorySpy },
          { provide: OneInchFactory, useValue: oneInchFactorySpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: WalletsFactory, useValue: walletsFactorySpy },
          { provide: GasStationOfFactory, useValue: gasStationOfFactorySpy },
          { provide: SwapTransactionsFactory, useValue: swapTransactionsFactorySpy },
          { provide: ToastService, useValue: toastServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SwapHomePage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track screenview event on init', () => {
    component.ionViewDidEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should call appTrackEvent on trackService when swap button is clicked', () => {
    spyOn(component, 'swapThem');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_swaps_swap');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should button disabled on invalid value in from token amount input', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_swaps_swap"]'));

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

  it('password modal open on click swap button', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();

    await component.swapThem();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([component.swapInProgressUrl]);
  });

  it('password modal open on click swap button and password is invalid', fakeAsync(() => {
    walletsFactorySpy.create.and.returnValue(
      { oneBy: () => Promise.resolve(new FakeWallet(Promise.resolve(false), 'invalid password')) }
    );
    component.ionViewDidEnter();
    tick();
    fakeModalController.modifyReturns({}, { data: 'aStringPassword' });
    fixture.detectChanges();

    component.swapThem();
    tick(2);

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
  }));
});
