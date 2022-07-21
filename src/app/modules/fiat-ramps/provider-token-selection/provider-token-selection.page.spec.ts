import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { TokenSelectionListComponent } from 'src/app/shared/components/token-selection-list/token-selection-list.component';
import { SuitePipe } from 'src/app/shared/pipes/suite/suite.pipe';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { ProviderTokenSelectionPage } from './provider-token-selection.page';
import { FakeActivatedRoute } from '../../../../testing/fakes/activated-route.fake.spec';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { Providers } from '../shared-ramps/models/providers/providers.interface';

const coins: Coin[] = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    moonpayCode: 'keth',
    native: true,
    rpc: '',
  },
  {
    id: 16,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.png',
    last: false,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 80001,
    moonpayCode: 'matic_polygon',
    decimals: 18,
    native: true,
    rpc: '',
  },
  {
    id: 19,
    name: 'CAKE - Pancake Swap',
    logoRoute: 'assets/img/coins/PANCAKE.png',
    last: false,
    value: 'CAKE',
    network: 'BSC_BEP20',
    chainId: 97,
    rpc: ``,
    decimals: 18,
    symbol: 'CAKEUSDT',
  },
];
const expectedCoins: Coin[] = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    moonpayCode: 'keth',
    native: true,
    rpc: '',
  },
  {
    id: 16,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.png',
    last: false,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 80001,
    moonpayCode: 'matic_polygon',
    decimals: 18,
    native: true,
    rpc: '',
  },
];
const coinClicked = {
  id: 1,
  name: 'MATIC - MATIC',
  logoRoute: 'assets/img/coins/MATIC.png',
  last: false,
  value: 'MATIC',
  network: 'MATIC',
  chainId: 42,
  moonpayCode: 'matic',
  native: true,
  rpc: '',
};

describe('ProviderTokenSelectionPage', () => {
  let component: ProviderTokenSelectionPage;
  let fixture: ComponentFixture<ProviderTokenSelectionPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;

  beforeEach(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    fakeActivatedRoute = new FakeActivatedRoute({ provider: 'moonpay' }, { country: 'COL' });
    activatedRouteSpy = fakeActivatedRoute.createSpy();

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: [
        jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' }),
        jasmine.createSpyObj('Coin', {}, { value: 'DAI', network: 'MATIC' }),
      ],
    });

    providersSpy = jasmine.createSpyObj('Providers', {
      all: rawProvidersData,
      byAlias: rawProvidersData.find((provider) => provider.alias === 'kripton'),
    });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: providersSpy,
    });

    TestBed.configureTestingModule({
      declarations: [ProviderTokenSelectionPage, FakeTrackClickDirective, TokenSelectionListComponent, SuitePipe],
      imports: [IonicModule, TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderTokenSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a list of coins', async () => {
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('app-token-selection-list'));
    expect(list).toBeTruthy();
  });

  it('should navigate to moonpay page when itemClicked event is fired', async () => {
    providersSpy.byAlias.and.returnValue(rawProvidersData.find((provider) => provider.alias === 'moonpay'));
    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: 'MATIC',
        network: 'MATIC',
        country: 'COL',
      },
    };
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-token-selection-list')).triggerEventHandler('clickedCoin', coinClicked);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(
      ['/fiat-ramps/new-operation/moonpay'],
      navigationExtras
    );
  });

  it('should navigate to kripton new operation page when clickedCoin event is fired', async () => {
    fakeActivatedRoute.modifySnapshotParams({ provider: 'kripton' }, { country: 'ARS' });

    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: 'MATIC',
        network: 'MATIC',
        country: 'ARS',
      },
    };
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-token-selection-list')).triggerEventHandler('clickedCoin', coinClicked);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(
      ['/fiat-ramps/new-operation/kripton'],
      navigationExtras
    );
  });
});