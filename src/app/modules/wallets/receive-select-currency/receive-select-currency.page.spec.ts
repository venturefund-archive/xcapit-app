import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { ReceiveSelectCurrencyPage } from './receive-select-currency.page';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TokenSelectionListComponent } from '../../../shared/components/token-selection-list/token-selection-list.component';
import { SuitePipe } from '../../../shared/pipes/suite/suite.pipe';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { NavigationExtras } from '@angular/router';

const coins: Coin[] = [
  {
    id: 1,
    name: 'BTC - Bitcoin',
    logoRoute: 'assets/img/coins/BTC.svg',
    value: 'BTC',
    network: 'RSK',
    chainId: 42,
    rpc: '',
  },
  {
    id: 2,
    name: 'USDT - Tether',
    logoRoute: 'assets/img/coins/USDT.svg',
    value: 'USDT',
    network: 'ERC20',
    chainId: 42,
    rpc: '',
  },
];

const coinClicked = {
  id: 1,
  name: 'BTC - Bitcoin',
  logoRoute: 'assets/img/coins/BTC.svg',
  value: 'BTC',
  network: 'RSK',
  chainId: 42,
  rpc: '',
};

describe('ReceiveSelectCurrencyPage', () => {
  let component: ReceiveSelectCurrencyPage;
  let fixture: ComponentFixture<ReceiveSelectCurrencyPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getAssetsSelected: Promise.resolve(coins),
    });
    TestBed.configureTestingModule({
      declarations: [ReceiveSelectCurrencyPage, FakeTrackClickDirective, TokenSelectionListComponent, SuitePipe],
      imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiveSelectCurrencyPage);
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
    expect(component.coins).toEqual(coins);
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
        asset: 'BTC',
        network: 'RSK'
      },
    };
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-token-selection-list')).triggerEventHandler('clickedCoin', coinClicked);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/receive/detail'], navigationExtras);
  });

  it('should show no-active-tokens-card component when storage has no coins', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    storageServiceSpy.getAssetsSelected.and.returnValue(Promise.resolve([]));
    await fixture.whenStable();

    const cardEl = fixture.debugElement.query(By.css('app-no-active-tokens-card'))
    expect(cardEl).toBeTruthy();
  })
});
