import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavigationExtras } from '@angular/router';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { TokenSelectionListComponent } from 'src/app/shared/components/token-selection-list/token-selection-list.component';
import { SuitePipe } from 'src/app/shared/pipes/suite/suite.pipe';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { ProviderTokenSelectionPage } from './provider-token-selection.page';

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
  name: 'ETH - Ethereum',
  logoRoute: 'assets/img/coins/ETH.svg',
  last: false,
  value: 'ETH',
  network: 'ERC20',
  chainId: 42,
  moonpayCode: 'keth',
  native: true,
  rpc: '',
};

describe('ProviderTokenSelectionPage', () => {
  let component: ProviderTokenSelectionPage;
  let fixture: ComponentFixture<ProviderTokenSelectionPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getAssestsSelected: Promise.resolve(coins),
    });
    TestBed.configureTestingModule({
      declarations: [ProviderTokenSelectionPage, FakeTrackClickDirective, TokenSelectionListComponent, SuitePipe],
      imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderTokenSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user selected coins of storage on init', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.coins).toEqual(expectedCoins);
  });

  it('should render a list of coins', async () => {
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('app-token-selection-list'));
    expect(list).toBeTruthy();
  });

  it('should navigate when itemClicked event fired', async () => {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: 'ETH',
        network: 'ERC20'
      },
    };
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-token-selection-list')).triggerEventHandler('clickedCoin', coinClicked);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/fiat-ramps/moonpay'], navigationExtras);
  });
});
