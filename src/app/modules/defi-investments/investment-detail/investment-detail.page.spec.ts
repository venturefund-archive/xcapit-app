import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TwoPiApi } from '../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { Vault } from '@2pi-network/sdk';
import { InvestmentDetailPage } from './investment-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { WalletEncryptionService } from '../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { TwoPiInvestment } from '../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { InvestmentProduct } from '../shared-defi-investments/interfaces/investment-product.interface';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { AvailableDefiProducts } from '../shared-defi-investments/models/available-defi-products/available-defi-products.model';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { GraphqlService } from '../../wallets/shared-wallets/services/graphql/graphql.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

const testVault = {
  apy: 0.227843965358873,
  balances: [],
  contract_address: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38',
  deposits: [],
  identifier: 'polygon_usdc',
  pid: 1,
  token: 'USDC',
  token_address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
  tvl: 1301621680000,
} as Vault;

const dataTest = {
  data: {
    flows: [
      {
        amount: '500024348558355473',
        balance: '0',
        balanceUSD: '0',
        timestamp: '1661194501',
        type: 'withdraw',
      },
      {
        amount: '50123123132355473',
        balance: '12123',
        balanceUSD: '1232',
        timestamp: '1661194501',
        type: 'deposit',
      },
      {
        amount: '500024348558355473',
        balance: '0',
        balanceUSD: '0',
        timestamp: '1661194501',
        type: 'withdraw',
      },
      {
        amount: '500024348558355473',
        balance: '0',
        balanceUSD: '0',
        timestamp: '1661194501',
        type: 'withdraw',
      },
    ],
  },
};
const firstMovementsTest = [
  {
    amount: '500024348558355473',
    balance: '0',
    balanceUSD: '0',
    timestamp: '1661194501',
    type: 'withdraw',
  },
  {
    amount: '50123123132355473',
    balance: '12123',
    balanceUSD: '1232',
    timestamp: '1661194501',
    type: 'deposit',
  },
  {
    amount: '500024348558355473',
    balance: '0',
    balanceUSD: '0',
    timestamp: '1661194501',
    type: 'withdraw',
  },
];
const remainingMovementsTest = [
  {
    amount: '500024348558355473',
    balance: '0',
    balanceUSD: '0',
    timestamp: '1661194501',
    type: 'withdraw',
  },
];

describe('InvestmentDetailPage', () => {
  let component: InvestmentDetailPage;
  let fixture: ComponentFixture<InvestmentDetailPage>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let twoPiApiSpy: jasmine.SpyObj<TwoPiApi>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let fakeNavController: FakeNavController;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InvestmentDetailPage>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let investmentSpy: jasmine.SpyObj<TwoPiInvestment>;
  let investmentProductSpy: jasmine.SpyObj<InvestmentProduct>;
  let createInvestmentProductSpy: jasmine.Spy<any>;
  let availableDefiProductsSpy: jasmine.SpyObj<AvailableDefiProducts>;
  let coinSpy: jasmine.SpyObj<Coin>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let graphqlServiceSpy: jasmine.SpyObj<GraphqlService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    fakeActivatedRoute = new FakeActivatedRoute({ vault: 'polygon_usdc' });
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    walletServiceSpy = jasmine.createSpyObj('WalletService', {
      walletExist: Promise.resolve(true),
    });

    twoPiApiSpy = jasmine.createSpyObj('TwoPiApi', {
      vault: Promise.resolve(testVault),
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getPrices: of({ prices: { USDC: 1 } }),
      getCoins: [coinSpy],
    });

    walletEncryptionServiceSpy = jasmine.createSpyObj(
      'WalletEncryptionServiceSpy',
      {
        getEncryptedWallet: Promise.resolve({ addresses: { MATIC: '0x0000001' } }),
      },
      {
        addresses: { MATIC: '0x0000001' },
      }
    );

    investmentSpy = jasmine.createSpyObj('TwoPiInvestment', {
      balance: Promise.resolve(50),
    });

    coinSpy = jasmine.createSpyObj(
      {},
      {
        name: 'USDC - USD Coin',
        value: 'USDC',
        network: 'MATIC',
      }
    );

    investmentProductSpy = jasmine.createSpyObj('InvestmentProduct', {
      id: 3,
      token: coinSpy,
      contractAddress: '0x00001',
      name: 'polygon_usdc',
      decimals: 6,
    });

    availableDefiProductsSpy = jasmine.createSpyObj('AvailableDefiProducts', {
      value: [{ id: 'polygon_usdc', isComing: false, continuousEarning: true }],
    });

    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', { getObject: [{ id: 'polygon_usdc' }] });

    graphqlServiceSpy = jasmine.createSpyObj('GraphqlService', {
      getAllMovements: of(dataTest),
    });

    TestBed.configureTestingModule({
      declarations: [InvestmentDetailPage, FakeTrackClickDirective, FormattedAmountPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: TwoPiApi, useValue: twoPiApiSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: RemoteConfigService, useValue: remoteConfigSpy },
        { provide: GraphqlService, useValue: graphqlServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    createInvestmentProductSpy = spyOn(component, 'createInvestmentProduct').and.resolveTo(investmentProductSpy);
    component.allMovements = dataTest.data.flows;
    component.firstMovements = firstMovementsTest;
    component.remainingMovements = remainingMovementsTest;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly app-expandable-investment-info component', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const componentEl = fixture.debugElement.query(By.css('app-expandable-investment-info'));
    expect(componentEl).toBeTruthy();
  });

  it('should render properly invested-balance item', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);

    const titleEl = fixture.debugElement.query(By.css('div.invested-balance__content__label > ion-text'));
    const balanceEl = fixture.debugElement.query(By.css('div.invested-balance__content__balance__token > ion-text'));
    const referenceBalanceEl = fixture.debugElement.query(By.css('div.invested-balance__content__balance__usd > ion-text'));

    expect(titleEl.nativeElement.innerHTML).toContain('defi_investments.invest_detail.invested_amount');
    expect(balanceEl.nativeElement.innerHTML).toContain(50.0);
    expect(referenceBalanceEl.nativeElement.innerHTML).toEqual(' = 50 USD ');
  });
 
  it('should call trackEvent when ux_invest_withdraw button is clicked', async () => {
    component.investmentProduct = investmentProductSpy;
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'ux_invest_withdraw');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should create investment', async () => {
    expect(await component.createInvestment(investmentProductSpy, '0x')).toBeInstanceOf(TwoPiInvestment);
  });

  it('should render disclaimer of continuous earning if product have continuousEarnings on true', async () => {
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const disclaimerEl = fixture.debugElement.query(By.css('div.id__weekly-profit-disclaimer > ion-label'));
    expect(disclaimerEl.nativeElement.innerHTML).toContain('defi_investments.invest_detail.continuous_update');
  });

  it('should render disclaimer of weekly earning if product have continuousEarnings on false', async () => {
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    availableDefiProductsSpy.value.and.returnValue([
      { id: 'polygon_usdc', isComing: false, continuousEarning: false, category: 'test' },
    ]);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const disclaimerEl = fixture.debugElement.query(By.css('div.id__weekly-profit-disclaimer > ion-label'));
    expect(disclaimerEl.nativeElement.innerHTML).toContain('defi_investments.invest_detail.weekly_update');
  });

  it('should get investment history on view did enter', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    expect(component.allMovements).toEqual(dataTest.data.flows);
  });

  it('should filter invesment movements of complete data', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    expect(component.firstMovements).toEqual(firstMovementsTest);
    expect(component.remainingMovements).toEqual(remainingMovementsTest);
  });

  it('should open information modal when click on Cumulative yield info button', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Cumulative yield info button"]')).nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should render yields properly', async () => {
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    expect(component.yield).toEqual({ value: jasmine.any(Number), token: 'USDC' });
    expect(component.usdYield).toEqual({ value: jasmine.any(Number), token: 'USD' });
  });
});
