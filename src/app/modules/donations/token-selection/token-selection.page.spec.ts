import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { rawETHData, rawUSDTData } from '../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TokenSelectionPage } from './token-selection.page';

describe('TokenSelectionPage', () => {
  let component: TokenSelectionPage;
  let fixture: ComponentFixture<TokenSelectionPage>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let coinsSpy: jasmine.SpyObj<Coin>[];
  let clickedCoinSpy: jasmine.SpyObj<any>;
  let causeSpy: jasmine.SpyObj<any>;
  beforeEach(waitForAsync(() => {
    fakeActivatedRoute = new FakeActivatedRoute(null, {cause:'unhcr'});
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    coinsSpy = [jasmine.createSpyObj('Coin', {}, rawETHData), jasmine.createSpyObj('Coin', {}, rawUSDTData)];
    causeSpy = jasmine.createSpyObj(
      'cause',
      {},
      {
        id: 'unhcr',
        title: 'UNHCR',
        description: 'donations.description_cause.info.unhcr.description',
        addresses: [
          {
            address: '0xFaB6d79902329D7f3242060bb7E6cd2c59E9fA66',
            token: { network: 'ERC20', value: 'ETH' },
          },
        ],
      }
    );
    clickedCoinSpy = jasmine.createSpyObj(
      'Clicked Coin',
      {},
      {
        id: 1,
        name: 'ETH - Ethereum',
        logoRoute: 'assets/img/coins/ETH-ERC20.svg',
        last: false,
        value: 'ETH',
        network: 'ERC20',
        rpc: 'http://testrpc.test/',
        native: true,
      }
    );
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
      getCoins: coinsSpy,
    });
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [TokenSelectionPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenSelectionPage);
    component = fixture.componentInstance;
    component.causes = [causeSpy];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    component.ngOnInit();
    const listEl = fixture.debugElement.query(By.css('app-token-selection-list'));
    const titleEl = fixture.debugElement.query(By.css('.dts__title ion-label'));
    expect(listEl).toBeTruthy();
    expect(titleEl).toBeTruthy();
  });
  it('should render properly', () => {
    component.ngOnInit();
    const listEl = fixture.debugElement.query(By.css('app-token-selection-list'));
    listEl.triggerEventHandler('clickedCoin', clickedCoinSpy);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([ 'donations/send-donation/cause', 'unhcr', 'value', 'ETH', 'network', 'ERC20' ])
  });
});