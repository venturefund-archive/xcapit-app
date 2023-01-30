import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

describe('ProviderTokenSelectionPage', () => {
  let component: ProviderTokenSelectionPage;
  let fixture: ComponentFixture<ProviderTokenSelectionPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;

  beforeEach(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: [
        jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' }),
        jasmine.createSpyObj('Coin', {}, { value: 'DAI', network: 'MATIC' }),
      ],
    });

    tokenOperationDataServiceSpy = jasmine.createSpyObj(
      'TokenOperationDataService',
      {},
      {
        tokenOperationData: {},
      }
    );

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
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
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

  it('should render a list of coins', async () => {
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('app-token-selection-list'));
    expect(list).toBeTruthy();
  });

  it('should navigate to provider selection page when clickedCoin event is fired', async () => {
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-token-selection-list')).triggerEventHandler('clickedCoin', coinClicked);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/select-provider']);
  });
});
