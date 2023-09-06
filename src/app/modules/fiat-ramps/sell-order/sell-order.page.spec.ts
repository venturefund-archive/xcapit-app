import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { of, Subject } from 'rxjs';
import { FakeERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/fake/fake-erc20-provider';
import { SellOrderPage } from './sell-order.page';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { WalletEncryptionService } from '../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { DynamicKriptonPriceFactory } from '../shared-ramps/models/kripton-price/factory/dynamic-kripton-price-factory';
import { DynamicKriptonPrice } from '../shared-ramps/models/kripton-price/dynamic-kripton-price';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { DefaultBlockchains } from '../../swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainRepo } from '../../swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { rawBlockchainsData } from '../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { ERC20Contract } from '../../defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { Erc20ProviderInjectable } from '../../defi-investments/shared-defi-investments/models/erc20-provider/injectable/erc20-provider.injectable';
import { ERC20ContractInjectable } from '../../defi-investments/shared-defi-investments/models/erc20-contract/injectable/erc20-contract.injectable';
import { FakeContract } from '../../defi-investments/shared-defi-investments/models/fake-contract/fake-contract.model';
import { FakeProvider } from 'src/app/shared/models/provider/fake-provider.spec';
import { BigNumber } from 'ethers';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { GasStationOfFactory } from '../../swaps/shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { AmountOf } from '../../wallets/shared-wallets/models/blockchain-tx/amount-of/amount-of';
import { DefaultToken } from '../../swaps/shared-swaps/models/token/token';
import { rawMATICData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { UserBankDataService } from '../shared-ramps/services/user-bank-data/user-bank-data.service';

const availableKriptonCurrencies = [
  {
    network: 'MATIC',
    currencies: ['USDC', 'MATIC', 'DAI'],
  },
];
const validForm = {
  cryptoAmount: 20,
  fiatAmount: 8000,
  thirdPartyKYC: true,
  thirdPartyTransaction: true,
  acceptTOSAndPrivacyPolicy: true,
};
const rawOperationData = {
  country: 'country',
  type: 'cash-out',
  amount_in: 100.00129870129871,
  amount_out: 100,
  currency_in: 'USDC',
  currency_out: 'ARS',
  price_in: '1',
  price_out: '100',
  wallet: '0x000000000000000000000dead',
  provider: '1',
  network: 'MATIC',
  kripton_wallet: 'XXXXXXXXXXXXXXXXXXXXX',
};

const operationData = {
  email: 'test@test.com',
  auth_token: 'test',
  payment_method_id: 100,
  ...rawOperationData,
};

const rawUserBankData = {
  account_number: '123456',
  account_type: 'Ahorro',
  alias: 'An alias',
  cbu_cvu: '1234567890',
  country: 'ARG',
  currency: 'USDC',
  mail: 'hola@hola.com',
  name: 'asd',
  number_of_document: '123',
  type_of_document: 'DNI',
};

const userBankData = {
  email: 'test@test.com',
  auth_token: 'test',
  ...rawUserBankData,
};

describe('SellOrderPage', () => {
  let component: SellOrderPage;
  let fixture: ComponentFixture<SellOrderPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SellOrderPage>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let storageOperationServiceSpy: jasmine.SpyObj<StorageOperationService>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let dynamicKriptonPriceSpy: jasmine.SpyObj<DynamicKriptonPrice>;
  let kriptonDynamicPriceFactorySpy: jasmine.SpyObj<DynamicKriptonPriceFactory>;
  let priceSubject: Subject<number>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let coinsSpy: jasmine.SpyObj<Coin>[];
  let kriptonStorageServiceSpy: jasmine.SpyObj<KriptonStorageService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let gasStationOfFactorySpy: jasmine.SpyObj<GasStationOfFactory>;
  let fakeModalController: FakeModalController;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let erc20ContractSpy: jasmine.SpyObj<ERC20Contract>;
  let erc20ProviderInjectableSpy: jasmine.SpyObj<Erc20ProviderInjectable>;
  let erc20ContractInjectableSpy: jasmine.SpyObj<ERC20ContractInjectable>;
  let userBankDataServiceSpy: jasmine.SpyObj<UserBankDataService>;

  const blockchain = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData)).oneByName('MATIC');

  beforeEach(waitForAsync(() => {
    storageOperationServiceSpy = jasmine.createSpyObj('StorageOperationService', {
      updateData: null,
      getData: rawOperationData,
    });

    userBankDataServiceSpy = jasmine.createSpyObj(
      'UserBankDataService',
      {},
      {
        userBankData: rawUserBankData,
      }
    );

    navControllerSpy = new FakeNavController().createSpy();

    priceSubject = new Subject<number>();

    dynamicKriptonPriceSpy = jasmine.createSpyObj('DynamicKriptonPrice', {
      value: priceSubject,
    });

    kriptonDynamicPriceFactorySpy = jasmine.createSpyObj('KriptonDynamicPriceFactory', {
      new: dynamicKriptonPriceSpy,
    });

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: {
        oneByName: () => {
          return blockchain;
        },
      },
    });

    coinsSpy = [
      jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' }),
      jasmine.createSpyObj('Coin', {}, { value: 'USDC', network: 'MATIC' }),
    ];

    erc20ProviderInjectableSpy = jasmine.createSpyObj('ERC20ProviderInjectable', {
      create: new FakeERC20Provider(null, new FakeProvider('100000000')),
    });

    erc20ContractSpy = jasmine.createSpyObj('ERC20Contract', {
      value: new FakeContract({ transfer: () => Promise.resolve(BigNumber.from('10')) }),
    });

    erc20ContractInjectableSpy = jasmine.createSpyObj('ERC20ProviderInjectable', {
      create: erc20ContractSpy,
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: coinsSpy,
    });

    providersSpy = jasmine.createSpyObj('Providers', {
      all: rawProvidersData,
      byAlias: rawProvidersData.find((provider) => provider.alias === 'kripton'),
    });

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve(['testAddress']),
    });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: providersSpy,
    });

    gasStationOfFactorySpy = jasmine.createSpyObj('GasStationOfFactory', {
      create: {
        price: () => ({
          standard: () => Promise.resolve(new AmountOf('100000000000', new DefaultToken(rawMATICData))),
        }),
      },
    });
    kriptonStorageServiceSpy = jasmine.createSpyObj('KriptonStorageService', {
      get: Promise.resolve(),
      set: Promise.resolve(),
    });

    kriptonStorageServiceSpy.get.withArgs('email').and.resolveTo('test@test.com');
    kriptonStorageServiceSpy.get.withArgs('access_token').and.resolveTo('test');
    kriptonStorageServiceSpy.get.withArgs('privacy_and_policy_accepted').and.resolveTo(true);

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getUserWallets: of({}),
      getOrCreateUser: of({}),
      setProvider: null,
      registerUserBank: of({ id: 100 }),
      createOperation: of({ id: 345, created_at: '2000-1-1' }),
      getKriptonMinimumAmount: of({ minimum_general: 20 }),
      getKriptonAvailableCurrencies: of(availableKriptonCurrencies),
      getKriptonFee: of({ data: { costs: '0.50', amount_in: '100', amount_out: '200' } }),
    });

    tokenOperationDataServiceSpy = jasmine.createSpyObj(
      'TokenOperationDataService',
      {},
      {
        tokenOperationData: { asset: 'USDC', network: 'MATIC', country: 'ARG' },
      }
    );

    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      getEncryptedWallet: Promise.resolve({ addresses: { MATIC: '0x00000000000000' } }),
    });

    fakeModalController = new FakeModalController({});
    modalControllerSpy = fakeModalController.createSpy();

    TestBed.configureTestingModule({
      declarations: [SellOrderPage, FakeTrackClickDirective],
      imports: [HttpClientTestingModule, IonicModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: StorageOperationService, useValue: storageOperationServiceSpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: DynamicKriptonPriceFactory, useValue: kriptonDynamicPriceFactorySpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: KriptonStorageService, useValue: kriptonStorageServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: GasStationOfFactory, useValue: gasStationOfFactorySpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: Erc20ProviderInjectable, useValue: erc20ProviderInjectableSpy },
        { provide: ERC20ContractInjectable, useValue: erc20ContractInjectableSpy },
        { provide: UserBankDataService, useValue: userBankDataServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SellOrderPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component.fiatPrice = 385;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set properly cryptoAmount form value with minimum crypto amount', async () => {
    dynamicKriptonPriceSpy.value.and.returnValue(of(1));
    fiatRampsServiceSpy.getKriptonFee.and.returnValue(
      of({ data: { costs: '0.50', amount_in: '100', amount_out: '3700' } })
    );
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    expect(component.form.controls.fiatAmount.value).toEqual(3700);
  });

  it('should set country, default currency, provider and price on init', async () => {
    await component.ionViewWillEnter();
    priceSubject.next(1);
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    expect(fiatRampsServiceSpy.setProvider).toHaveBeenCalledOnceWith('1');
    expect(component.providerTokens).toEqual(coinsSpy);
    expect(component.selectedCurrency).toEqual(coinsSpy[1]);
    expect(component.fiatCurrency).toEqual('ars');
    expect(component.fiatPrice).toEqual(1);
    expect(fiatRampsServiceSpy.getKriptonMinimumAmount).toHaveBeenCalledOnceWith({
      currency_in: coinsSpy[1].value,
      operation_type: 'cash-out',
      currency_out: 'ars',
      email: 'test@test.com',
      network_out: coinsSpy[1].network,
    });
  });

  it('should call trackEvent on trackService when ux_buy_kripton_continue Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_sell_amount_continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe when leave', async () => {
    await component.ionViewWillEnter();
    const nextSpy = spyOn(component.destroy$, 'next');
    const completeSpy = spyOn(component.destroy$, 'complete');

    component.ionViewWillLeave();

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should update provider fee when price changes', fakeAsync(() => {
    const costs = 0.78;
    const fiatPrice = 385;
    fiatRampsServiceSpy.getKriptonFee.and.returnValues(
      of({ data: { costs, amount_in: '20.779221', amount_out: '8000' } }),
      of({ data: { costs, amount_in: '20.779221', amount_out: '8311.6884' } })
    );
    component.minimumCryptoAmount = 20;
    component.fiatPrice = fiatPrice;
    component.ionViewWillEnter();
    tick();
    component.form.patchValue({ fiatAmount: 8000 });
    tick();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('app-provider-new-operation-card')).nativeElement;
    expect(el.providerFee.value).toEqual(costs / fiatPrice);
    priceSubject.next(0.0025);
    tick();
    fixture.detectChanges();
    expect(el.providerFee.value).toEqual(0.0019500000000000001);
  }));

  it('should validate that the crypto amount is greater or equals the minimum value in crypto currency', async () => {
    dynamicKriptonPriceSpy.value.and.returnValue(of(0.00125));
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    component.form.patchValue({ cryptoAmount: 19 });
    fixture.detectChanges();
    expect(component.form.controls.cryptoAmount.valid).toBeFalse();
    component.form.patchValue({ cryptoAmount: 21 });
    fixture.detectChanges();
    expect(component.form.controls.cryptoAmount.valid).toBeTrue();
  });

  it('should show modal', async () => {
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('app-provider-new-operation-card'))
      .triggerEventHandler('changeCurrency', undefined);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should create and save operation and redirect to purchase order when valid form is submitted', async () => {
    await component.ionViewWillEnter();
    component.form.patchValue(validForm);
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    await component.handleSubmit();
    expect(kriptonStorageServiceSpy.set).toHaveBeenCalledWith('privacy_and_policy_accepted', true);
    expect(storageOperationServiceSpy.updateData).toHaveBeenCalledTimes(2);
    expect(fiatRampsServiceSpy.registerUserBank).toHaveBeenCalledOnceWith(userBankData);
    expect(fiatRampsServiceSpy.createOperation).toHaveBeenCalledOnceWith(operationData);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('fiat-ramps/kripton-summary');
  });
});
