import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { SendDetailPage } from './send-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from '../../../../../testing/track-click-directive-test.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FakeTrackClickDirective } from '../../../../../testing/fakes/track-click-directive.fake.spec';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { ApiWalletService } from '../../shared-wallets/services/api-wallet/api-wallet.service';
import { ERC20ProviderController } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/controller/erc20-provider.controller';
import { ERC20ContractController } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/controller/erc20-contract.controller';
import { FakeERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/fake/fake-erc20-provider';
import { FakeNavController } from '../../../../../testing/fakes/nav-controller.fake.spec';
import { FakeProvider } from '../../../../shared/models/provider/fake-provider.spec';
import { BigNumber } from 'ethers';
import { FakeContract } from '../../../defi-investments/shared-defi-investments/models/fake-contract/fake-contract.model';
import { ERC20Contract } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { of } from 'rxjs';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';
import { FakeActivatedRoute } from '../../../../../testing/fakes/activated-route.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { TokenOperationDataService } from 'src/app/modules/fiat-ramps/shared-ramps/services/token-operation-data/token-operation-data.service';
import { GasStationOfFactory } from 'src/app/modules/swaps/shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { rawBlockchainsData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { AmountOf } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';
import { DefaultToken } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import {
  rawETHData,
  rawSOLData,
  rawTokensData,
  rawUSDTData,
} from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { FakeWallet } from '../../../swaps/shared-swaps/models/wallet/wallet';
import { WalletsFactory } from '../../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { TokenDetailInjectable } from '../../shared-wallets/models/token-detail/injectable/token-detail.injectable';
import { TokenDetail } from '../../shared-wallets/models/token-detail/token-detail';
import { SolanaFeeOfInjectable } from '../../shared-wallets/models/solana-fee-of/injectable/solana-fee-of-injectable';

describe('SendDetailPage', () => {
  let component: SendDetailPage;
  let fixture: ComponentFixture<SendDetailPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SendDetailPage>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let erc20ContractSpy: jasmine.SpyObj<ERC20Contract>;
  let erc20ProviderControllerSpy: jasmine.SpyObj<ERC20ProviderController>;
  let erc20ContractControllerSpy: jasmine.SpyObj<ERC20ContractController>;
  let dynamicPriceFactorySpy: jasmine.SpyObj<DynamicPriceFactory>;
  let dynamicPriceSpy: jasmine.SpyObj<DynamicPrice>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let gasStationOfFactorySpy: jasmine.SpyObj<GasStationOfFactory>;
  let walletsFactorySpy: jasmine.SpyObj<WalletsFactory>;
  let tokenDetailInjectableSpy: jasmine.SpyObj<TokenDetailInjectable>;
  let tokenDetailSpy: jasmine.SpyObj<TokenDetail>;
  let solanaFeeOfInjectableSpy: jasmine.SpyObj<SolanaFeeOfInjectable>;
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));
  const _continueButton = (): DebugElement => {
    return trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_send_continue');
  };
  const formData = {
    valid: {
      address: '0x925F1b4d8092bd94608b1f680B87F87F0bd737DC',
      amount: 1,
      quoteAmount: 1,
    },
    solanaValid: {
      address: 'iuwtfpp8yzDrJNQbHXBSufSCZKhGctw5bQFAx23VgBH',
      amount: 1,
      quoteAmount: 1,
    },
  };

  beforeEach(() => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve(['testAddress']),
    });

    fakeActivatedRoute = new FakeActivatedRoute({ token: rawUSDTData.contract, blockchain: rawUSDTData.network });
    activatedRouteSpy = fakeActivatedRoute.createSpy();

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: rawTokensData,
      getPrices: of({ prices: { USDT: 1, ETH: 1, BTC: 1 } }),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    tokenOperationDataServiceSpy = jasmine.createSpyObj('TokenOperationDataService', {
      tokenOperationData: { asset: 'USDC', network: 'MATIC', country: 'ECU' },
    });
    erc20ProviderControllerSpy = jasmine.createSpyObj('ERC20ProviderController', {
      new: new FakeERC20Provider(null, new FakeProvider('100000000')),
    });

    erc20ContractSpy = jasmine.createSpyObj('ERC20Contract', {
      value: new FakeContract({ transfer: () => Promise.resolve(BigNumber.from('10')) }),
    });

    erc20ContractControllerSpy = jasmine.createSpyObj('ERC20ProviderController', {
      new: erc20ContractSpy,
    });

    dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(2) });

    dynamicPriceFactorySpy = jasmine.createSpyObj('DynamicPriceFactory', {
      new: dynamicPriceSpy,
    });

    walletsFactorySpy = jasmine.createSpyObj('WalletsFactory', {
      create: { oneBy: () => Promise.resolve(new FakeWallet()) },
    });

    solanaFeeOfInjectableSpy = jasmine.createSpyObj('SolanaFeeOfInjectable', {
      create: { value: () => Promise.resolve(10000000) },
    });

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    gasStationOfFactorySpy = jasmine.createSpyObj('GasStationOfFactory', {
      create: {
        price: () => ({
          standard: () => Promise.resolve(new AmountOf('100000000000', new DefaultToken(rawETHData))),
        }),
      },
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

    TestBed.configureTestingModule({
      declarations: [SendDetailPage, FakeTrackClickDirective],
      imports: [
        IonicModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: ERC20ProviderController, useValue: erc20ProviderControllerSpy },
        { provide: ERC20ContractController, useValue: erc20ContractControllerSpy },
        { provide: DynamicPriceFactory, useValue: dynamicPriceFactorySpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: WalletsFactory, useValue: walletsFactorySpy },
        { provide: GasStationOfFactory, useValue: gasStationOfFactorySpy },
        { provide: TokenDetailInjectable, useValue: tokenDetailInjectableSpy },
        { provide: SolanaFeeOfInjectable, useValue: solanaFeeOfInjectableSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SendDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find currency and networks on ionViewDidEnter', fakeAsync(() => {
    component.ionViewDidEnter();
    tick();

    expect(component.tplBlockchain.name).toEqual(rawUSDTData.network);
    expect(component.tplNativeToken.value).toEqual(rawETHData.value);
    expect(component.token).toEqual(rawUSDTData);
  }));

  it('should get native fee on ionViewDidEnter when token is native', fakeAsync(() => {
    fakeActivatedRoute.modifySnapshotParams({ token: rawETHData.contract, blockchain: rawETHData.network });
    component.form.patchValue({ amount: 1 });

    component.ionViewDidEnter();
    tick();

    expect(component.token).toEqual(rawETHData);
    expect(component.fee).toEqual(10);
  }));

  it('should calculate fee when user enters valid address and amount and token isnt native', fakeAsync(() => {
    component.ionViewDidEnter();
    tick();
    component.form.patchValue(formData.valid);
    tick();

    expect(component.fee).toEqual(0.000001);
  }));

  it('should reset fee when user enters invalid address or amount and token isnt native', fakeAsync(() => {
    component.ionViewDidEnter();
    tick();
    component.form.patchValue({ address: '' });
    tick();
    fixture.detectChanges();

    expect(component.dynamicFee.value).toEqual(0.0);
    expect(component.quoteFee.value).toEqual(0.0);
  }));

  it('should call trackEvent on trackService when ux_send_continue Button clicked', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const el = _continueButton();
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should save transaction data and navigate when ux_send_continue Button clicked and form valid', fakeAsync(() => {
    component.ionViewDidEnter();
    tick();
    component.form.patchValue(formData.valid);
    tick();

    _continueButton().nativeElement.click();
    tick();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/send/summary']);
  }));

  it('should save transaction data and navigate when ux_send_continue Button clicked, form valid and solana token', fakeAsync(() => {
    fakeActivatedRoute.modifySnapshotParams({ token: rawSOLData.contract, blockchain: rawSOLData.network });
    component.ionViewDidEnter();
    tick();
    component.form.patchValue(formData.solanaValid);
    tick();

    _continueButton().nativeElement.click();
    tick();

    expect(component.fee).toEqual(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/send/summary']);
  }));

  it('should show card if native token balance is zero when sending native token', async () => {
    fakeActivatedRoute.modifySnapshotParams({ token: rawETHData.contract, blockchain: rawETHData.network });
    tokenDetailSpy = jasmine.createSpyObj(
      'TokenDetail',
      {
        fetch: Promise.resolve(),
        cached: Promise.resolve(),
      },
      {
        price: 3000,
        balance: 0,
        quoteSymbol: 'USD',
      }
    );
    tokenDetailInjectableSpy.create.and.returnValue(tokenDetailSpy);

    await component.ionViewDidEnter();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not show card if native token balance is greater than zero when sending native token', async () => {
    fakeActivatedRoute.modifySnapshotParams({ token: rawETHData.contract, blockchain: rawETHData.network });

    await component.ionViewDidEnter();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });

  it('should let user change currency on selected currency click', async () => {
    fakeActivatedRoute.modifySnapshotParams({ token: rawETHData.contract, blockchain: rawETHData.network });
    await component.ionViewDidEnter();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('.sd__network-select-card__selected-coin > app-coin-selector'))
      .triggerEventHandler('changeCurrency', {});

    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/wallets/send/select-currency']);
  });

  it('should unsubscribe when leave', () => {
    const nextSpy = spyOn(component.destroy$, 'next');
    const completeSpy = spyOn(component.destroy$, 'complete');

    component.ionViewWillLeave();

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should show toast when native balance is less than fee', async () => {
    await component.ionViewDidEnter();
    component.nativeBalance = 0.5;
    component.fee = 1;

    await component.checkEnoughBalance();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should open modal when phraseAmountInfoClicked event is emited and isInfoModalOpen is false', async () => {
    component.isInfoModalOpen = false;
    await component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('app-amount-input-card')).triggerEventHandler('phraseAmountInfoClicked', null);

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not open modal when phraseAmountInfoClicked event is emited and isInfoModalOpen is true ', async () => {
    component.isInfoModalOpen = true;
    await component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('app-amount-input-card')).triggerEventHandler('phraseAmountInfoClicked', null);

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });

  it('should navigate when addFromContacts event is emited', async () => {
    await component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('app-address-input-card')).triggerEventHandler('addFromContacts', null);

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      'contacts/home/select/blockchain',
      component.tplBlockchain.name,
      'token',
      component.token.contract,
      'amount',
      component.form.value.amount,
    ]);
  });

  it('should set form data when address is present on URL', async () => {
    fakeActivatedRoute.modifySnapshotParams({
      token: rawUSDTData.contract,
      blockchain: rawUSDTData.network,
      address: formData.valid.address,
      amount: formData.valid.amount,
    });
    await component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.form.value.address).toEqual(formData.valid.address);
    expect(component.form.value.amount).toEqual(formData.valid.amount);
  });
});
