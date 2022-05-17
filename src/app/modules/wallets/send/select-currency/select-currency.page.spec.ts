import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { SelectCurrencyPage } from './select-currency.page';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FakeTrackClickDirective } from '../../../../../testing/fakes/track-click-directive.fake.spec';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { TokenSelectionListComponent } from '../../../../shared/components/token-selection-list/token-selection-list.component';
import { SuitePipe } from '../../../../shared/pipes/suite/suite.pipe';
import { NavigationExtras } from '@angular/router';

const coins: Coin[] = [
  {
    id: 1,
    name: 'BTC - Bitcoin',
    logoRoute: 'assets/img/coins/BTC.svg',
    last: false,
    value: 'BTC',
    network: 'RSK',
    chainId: 42,
    rpc: '',
  },
  {
    id: 2,
    name: 'USDT - Tether',
    logoRoute: 'assets/img/coins/USDT.svg',
    last: false,
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
  last: false,
  value: 'BTC',
  network: 'RSK',
  chainId: 42,
  rpc: '',
};

describe('SelectCurrencyPage', () => {
  let component: SelectCurrencyPage;
  let fixture: ComponentFixture<SelectCurrencyPage>;
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
      declarations: [SelectCurrencyPage, FakeTrackClickDirective, TokenSelectionListComponent, SuitePipe],
      imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectCurrencyPage);
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
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/send/detail'], navigationExtras);
  });
});
