import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { SendDetailPage } from './send-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from '../../../../../testing/track-click-directive-test.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { FakeTrackClickDirective } from '../../../../../testing/fakes/track-click-directive.fake.spec';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletService } from '../../shared-wallets/services/wallet/wallet.service';
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

const coins: Coin[] = [
  {
    id: 1,
    name: 'BTC - Bitcoin',
    logoRoute: '../../assets/img/coins/BTC.svg',
    last: false,
    value: 'BTC',
    network: 'BTC',
    chainId: 42,
    rpc: '',
    native: true,
  },
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'testRpc',
    native: true,
  },
  {
    id: 3,
    name: 'USDT - Tether',
    logoRoute: 'assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ERC20',
    chainId: 42,
    rpc: 'testRPC',
    contract: 'testContract',
    abi: null,
    decimals: 6,
  },
];

const formData = {
  valid: {
    address: 'asdfasdfasdfas',
    amount: '29',
    quoteAmount: '29',
  },
};

describe('SendDetailPage', () => {
  let component: SendDetailPage;
  let fixture: ComponentFixture<SendDetailPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SendDetailPage>;
  let activatedRouteMock: any;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let erc20ContractSpy: jasmine.SpyObj<ERC20Contract>;
  let erc20ProviderControllerSpy: jasmine.SpyObj<ERC20ProviderController>;
  let erc20ContractControllerSpy: jasmine.SpyObj<ERC20ContractController>;

  beforeEach(() => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve(['testAddress']),
    });
    walletServiceSpy = jasmine.createSpyObj('WalletService', {
      balanceOf: Promise.resolve('10'),
    });
    activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', ['get']);
    activatedRouteMock.snapshot = {
      queryParamMap: convertToParamMap({
        asset: 'USDT',
        network: 'ERC20',
      }),
    };
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: coins,
      getCoin: JSON.parse(JSON.stringify(coins[2])),
      getNativeTokenFromNetwork: JSON.parse(JSON.stringify(coins[1])),
      getNetworks: ['ERC20'],
      getGasPrice: of({ gas_price: 10 }),
      getPrices: of({ prices: { USDT: 1, ETH: 1, BTC: 1 } }),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    erc20ProviderControllerSpy = jasmine.createSpyObj('ERC20ProviderController', {
      new: new FakeERC20Provider(null, new FakeProvider('100000000')),
    });

    erc20ContractSpy = jasmine.createSpyObj('ERC20Contract', {
      value: new FakeContract({ transfer: () => Promise.resolve(BigNumber.from('10')) }),
    });

    erc20ContractControllerSpy = jasmine.createSpyObj('ERC20ProviderController', {
      new: erc20ContractSpy,
    });

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
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: NavController, useValue: navControllerSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: ERC20ProviderController, useValue: erc20ProviderControllerSpy },
        { provide: ERC20ContractController, useValue: erc20ContractControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SendDetailPage);
    component = fixture.componentInstance;
    component.nativeBalance = 1;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find currency and networks on ionViewWillEnter', async () => {
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    expect(component.networks).toEqual([coins[2].network]);
    expect(component.selectedNetwork).toEqual(coins[2].network);
    expect(component.nativeToken).toEqual(coins[1]);
    expect(component.nativeBalance).toEqual(10);
    expect(component.token).toEqual(coins[2]);
  });

  it('should get native fee on ionViewWillEnter when token is native', fakeAsync(() => {
    apiWalletServiceSpy.getCoin.and.returnValue(coins[1]);
    component.ionViewWillEnter();
    tick();
    fixture.detectChanges();
    expect(component.token).toEqual(coins[1]);
    expect(component.fee).toEqual(1e-9);
  }));

  it('should change selected network on event emited', () => {
    component.networks = ['ERC20', 'BTC'];
    component.selectedNetwork = 'ERC20';
    component.nativeToken = coins[1];
    fixture.detectChanges();
    expect(component.selectedNetwork).toBe('ERC20');
    const networkCard = fixture.debugElement.query(By.css('app-network-select-card'));
    networkCard.triggerEventHandler('networkChanged', 'BTC');
    fixture.detectChanges();
    expect(component.selectedNetwork).toBe('BTC');
  });

  it('should call trackEvent on trackService when ux_send_continue Button clicked', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_send_continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should calculate non native fee when ux_send_continue button is clicked and token is not native', fakeAsync(() => {
    component.token = coins[2];
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_send_continue');
    el.nativeElement.click();
    tick();
    fixture.detectChanges();
    expect(component.fee).toEqual(1000);
  }));

  it('should save transaction data and navigate when ux_send_continue Button clicked and form valid', fakeAsync(() => {
    apiWalletServiceSpy.getCoin.and.returnValue(coins[1]);
    component.ionViewWillEnter();
    tick();
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_send_continue');
    el.nativeElement.click();
    tick();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/send/summary']);
  }));

  it('should show card if native token balance is zero when sending native token', async () => {
    activatedRouteMock.snapshot = {
      queryParamMap: convertToParamMap({
        asset: 'ETH',
        network: 'ERC20',
      }),
    };
    walletServiceSpy.balanceOf.and.resolveTo('0');
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const alertCard = fixture.debugElement.query(By.css('app-ux-alert-message'));
    expect(alertCard).toBeDefined();
  });

  it('should show card if native token balance is zero when sending not native token', async () => {
    activatedRouteMock.snapshot = {
      queryParamMap: convertToParamMap({
        asset: 'USDT',
        network: 'ERC20',
      }),
    };
    walletServiceSpy.balanceOf.and.resolveTo('0');
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const alertCard = fixture.debugElement.query(By.css('app-ux-alert-message'));
    expect(alertCard).toBeDefined();
  });

  it('should not show card if native token balance is greater than zero when sending native token', async () => {
    activatedRouteMock.snapshot = {
      queryParamMap: convertToParamMap({
        asset: 'ETH',
        network: 'ERC20',
      }),
    };
    walletServiceSpy.balanceOf.and.resolveTo('1');
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const alertCard = fixture.debugElement.query(By.css('app-ux-alert-message'));
    expect(alertCard).toBeDefined();
  });

  it('should not show card if native token balance is greater than zero when sending not native token', async () => {
    activatedRouteMock.snapshot = {
      queryParamMap: convertToParamMap({
        asset: 'USDT',
        network: 'ERC20',
      }),
    };
    walletServiceSpy.balanceOf.and.resolveTo('1');
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const alertCard = fixture.debugElement.query(By.css('app-ux-alert-message'));
    expect(alertCard).toBeDefined();
  });

  it('should let user change currency on selected currency click', async () => {
    activatedRouteMock.snapshot = {
      queryParamMap: convertToParamMap({
        asset: 'ETH',
        network: 'ERC20',
      }),
    };
    walletServiceSpy.balanceOf.and.resolveTo('0');
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('.sd__network-select-card__selected-coin > app-coin-selector'))
      .triggerEventHandler('changeCurrency', {});
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/wallets/send/select-currency']);
  });
});
