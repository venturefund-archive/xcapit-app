import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { TokenSelectionListComponent } from 'src/app/shared/components/token-selection-list/token-selection-list.component';
import { SuitePipe } from 'src/app/shared/pipes/suite/suite.pipe';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { ProviderTokenSelectionPage } from './provider-token-selection.page';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { of } from 'rxjs';
import { TrackService } from 'src/app/shared/services/track/track.service';

describe('ProviderTokenSelectionPage', () => {
  let component: ProviderTokenSelectionPage;
  let fixture: ComponentFixture<ProviderTokenSelectionPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  const coinClicked = {
    id: 1,
    name: 'MATIC - MATIC',
    logoRoute: 'assets/img/coins/MATIC.svg',
    last: false,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 42,
    moonpayCode: 'matic',
    native: true,
    rpc: '',
  };

  const availableKriptonCurrencies = [
    {
      network: 'BSC',
      currencies: ['USDT', 'DAI'],
    },
    {
      network: 'MATIC',
      currencies: ['USDC', 'MATIC'],
    },
  ];

  beforeEach(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: [
        jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' }),
        jasmine.createSpyObj('Coin', {}, { value: 'DAI', network: 'MATIC' }),
      ],
    });

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    tokenOperationDataServiceSpy = jasmine.createSpyObj(
      'TokenOperationDataService',
      { add: {} },
      { tokenOperationData: { mode: 'buy' } }
    );

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getKriptonAvailableCurrencies: of(availableKriptonCurrencies),
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
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderTokenSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a list of coins', fakeAsync(() => {
    component.ionViewWillEnter();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('app-token-selection-list'));
    expect(list).toBeTruthy();
  }));

  it('should navigate to provider selection page when clickedCoin event is fired', fakeAsync(() => {
    component.ionViewWillEnter();
    tick();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-token-selection-list')).triggerEventHandler('clickedCoin', coinClicked);
    expect(tokenOperationDataServiceSpy.add).toHaveBeenCalledOnceWith({
      asset: coinClicked.value,
      network: coinClicked.network,
    });
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('fiat-ramps/select-provider');
  }));
});
