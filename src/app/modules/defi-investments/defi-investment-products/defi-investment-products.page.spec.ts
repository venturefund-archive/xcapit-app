import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { DefiInvestmentProductsPage } from './defi-investment-products.page';
import { TwoPiInvestment } from '../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { WalletEncryptionService } from '../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { AvailableDefiProducts } from '../shared-defi-investments/models/available-defi-products/available-defi-products.model';
import { DefiProduct } from '../shared-defi-investments/interfaces/defi-product.interface';
import { TwoPiProduct } from '../shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { InvestmentProduct } from '../shared-defi-investments/interfaces/investment-product.interface';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { ApiUsuariosService } from '../../users/shared-users/services/api-usuarios/api-usuarios.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { TwoPiApi } from '../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { Vault } from '@2pi-network/sdk';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { GraphqlService } from '../../wallets/shared-wallets/services/graphql/graphql.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { YieldCalculator } from '../shared-defi-investments/models/yield-calculator/yield-calculator.model';
import { TotalInvestedBalanceOfInjectable } from '../shared-defi-investments/models/total-invested-balance-of/injectable/total-invested-balance-of.injectable';
import { FakeTotalInvestedBalanceOf } from '../shared-defi-investments/models/total-invested-balance-of/fake/fake-total-invested-balance-of';
import { InvestedBalanceOfInjectable } from '../shared-defi-investments/models/invested-balance-of/injectable/invested-balance-of.injectable';
import { FakeInvestedBalanceOf } from '../shared-defi-investments/models/invested-balance-of/fake/fake-invested-balance-of';
import { FakeInvestedBalanceResponse } from '../shared-defi-investments/models/invested-balance-response/fake/fake-invested-balance-response';
import {
  NullInvestedBalanceResponse
} from '../shared-defi-investments/models/invested-balance-response/null/null-invested-balance-response';

const testCoins = [
  jasmine.createSpyObj(
    {},
    {
      name: 'USDC - USD Coin',
      value: 'USDC',
      network: 'MATIC',
      decimals: 6,
    }
  ),
];

const allMovementsTest = {
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

describe('DefiInvestmentProductsPage', () => {
  let component: DefiInvestmentProductsPage;
  let fixture: ComponentFixture<DefiInvestmentProductsPage>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let investmentSpy: jasmine.SpyObj<TwoPiInvestment>;
  let availableDefiProductsSpy: jasmine.SpyObj<AvailableDefiProducts>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let investmentProductSpy: jasmine.SpyObj<InvestmentProduct>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiUsuariosServiceSpy: jasmine.SpyObj<ApiUsuariosService>;
  let testUserSpy: jasmine.SpyObj<any>;
  let testUserWithTestSpy: jasmine.SpyObj<any>;
  let testAggressiveUserSpy: jasmine.SpyObj<any>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DefiInvestmentProductsPage>;
  let twoPiApiSpy: jasmine.SpyObj<TwoPiApi>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let graphqlServiceSpy: jasmine.SpyObj<GraphqlService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let totalInvestedBalanceOfInjectableSpy: jasmine.SpyObj<TotalInvestedBalanceOfInjectable>;
  let investedBalanceOfInjectableSpy: jasmine.SpyObj<InvestedBalanceOfInjectable>;
  beforeEach(waitForAsync(() => {
    twoPiApiSpy = jasmine.createSpyObj('TwoPiApi', {
      vault: Promise.resolve({
        apy: 0.227843965358873,
        balances: [],
        contract_address: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38',
        deposits: [],
        identifier: 'polygon_usdc',
        pid: 1,
        token: 'USDC',
        token_address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
        tvl: 1301621680000,
      } as Vault),
    });

    testUserSpy = jasmine.createSpyObj(
      'testUser',
      {},
      {
        profile: {
          investor_category: 'wealth_managements.profiles.no_category',
        },
      }
    );

    testUserWithTestSpy = jasmine.createSpyObj(
      'testUser',
      {},
      {
        profile: {
          investor_category: 'wealth_managements.profiles.conservative',
        },
      }
    );

    testAggressiveUserSpy = jasmine.createSpyObj(
      'testUser',
      {},
      {
        profile: {
          investor_category: 'wealth_managements.profiles.risky',
        },
      }
    );

    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();

    apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', { getUser: of(testUserWithTestSpy) });

    walletServiceSpy = jasmine.createSpyObj('WalletServiceSpy', {
      walletExist: Promise.resolve(true),
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
      getCoins: testCoins,
      getPrices: of({ prices: { USDC: 1 } }),
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

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve('0x00001'),
      getWalletFromStorage: Promise.resolve({
        addresses: { MATIC: 'testAddressMatic' },
      }),
    });

    investmentProductSpy = jasmine.createSpyObj('InvestmentProduct', {
      token: testCoins[0],
      contractAddress: '0x00001',
      decimals: 6,
    });

    investmentSpy = jasmine.createSpyObj(
      'TwoPiInvestment',
      {
        balance: Promise.resolve(50),
      },
      {
        product: investmentProductSpy,
      }
    );

    graphqlServiceSpy = jasmine.createSpyObj('GraphqlService', {
      getAllMovements: of(allMovementsTest),
    });

    availableDefiProductsSpy = jasmine.createSpyObj('AvailableDefiProducts', {
      value: [{ id: 'mumbai_usdc', isComing: false, category: 'conservative', continuousEarning: true }],
    });

    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', { getObject: [{ test: 'test' }] });

    totalInvestedBalanceOfInjectableSpy = jasmine.createSpyObj('TotalInvestedBalanceOfInjectable', {
      create: new FakeTotalInvestedBalanceOf(Promise.resolve(10.58354)),
    });
    investedBalanceOfInjectableSpy = jasmine.createSpyObj('InvestedBalanceOfInjectable', {
      create: new FakeInvestedBalanceOf(),
    });

    TestBed.configureTestingModule({
      declarations: [DefiInvestmentProductsPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: TwoPiApi, useValue: twoPiApiSpy },
        { provide: RemoteConfigService, useValue: remoteConfigSpy },
        { provide: GraphqlService, useValue: graphqlServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: TotalInvestedBalanceOfInjectable, useValue: totalInvestedBalanceOfInjectableSpy },
        { provide: InvestedBalanceOfInjectable, useValue: investedBalanceOfInjectableSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DefiInvestmentProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty div when no filtered products are available', async () => {
    investmentSpy.balance.and.resolveTo(0);
    apiUsuariosServiceSpy.getUser.and.returnValue(of(testAggressiveUserSpy));
    spyOn(component, 'calculateEarnings');
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const emptyEl = fixture.debugElement.query(By.css('div.dp__empty '));
    expect(emptyEl).toBeTruthy();
  });

  it('should render active investment card', async () => {
    spyOn(component, 'calculateEarnings');
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    component.ionViewDidLeave();
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const activeEl = fixture.debugElement.query(By.css('div.dp__active-card > ion-item > ion-label'));
    expect(activeEl.nativeElement.innerHTML).toContain('defi_investments.defi_investment_products.title_investments');

    const balanceEl = fixture.debugElement.query(By.css('app-investment-balance-item'));
    expect(balanceEl).toBeTruthy();
  });

  it('should render available investment card', fakeAsync(() => {
    investedBalanceOfInjectableSpy.create.and.returnValue(
      new FakeInvestedBalanceOf(Promise.resolve(new NullInvestedBalanceResponse()))
    );
    spyOn(component, 'calculateEarnings');
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    component.ionViewWillEnter();
    component.ionViewDidEnter();
    tick();
    fixture.detectChanges();

    const availableEl = fixture.debugElement.query(By.css('div.dp__available-card > ion-item > ion-label'));
    expect(availableEl.nativeElement.innerHTML).toContain('defi_investments.defi_investment_products.title');
    const productEl = fixture.debugElement.query(By.css('app-defi-investment-product'));
    expect(productEl).toBeTruthy();
  }));

  it('should render filter tab component', async () => {
    investmentSpy.balance.and.resolveTo(0);
    spyOn(component, 'calculateEarnings');
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const productEl = fixture.debugElement.query(By.css('app-filter-tab'));
    expect(productEl).toBeTruthy();
  });

  it('should set conservative filter when user didnt do test yet ', async () => {
    apiUsuariosServiceSpy.getUser.and.returnValue(of(testUserSpy));
    spyOn(component, 'calculateEarnings');
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(component.profileForm.value.profile).toEqual('conservative');
  });

  it('should call trackEvent on trackService when go_to_defi_faqs Button clicked', async () => {
    spyOn(component, 'calculateEarnings');
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'go_to_defi_faqs');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to deFi Faqs when go_to_defi_faqs button is clicked', async () => {
    spyOn(component, 'calculateEarnings');
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    component.ionViewWillEnter();
    await component.ionViewDidEnter();

    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="go_to_defi_faqs"'));
    buttonEl.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/support/faqs/wallet_operations']);
  });

  it('should render skeleton if there is not active investements and it is still loading', async () => {
    component.activeInvestments = [];
    component.allLoaded = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-defi-investment-product-skeleton'))).toBeTruthy();
  });

  it('should render no investments info if there is not active investements and loading has done', async () => {
    component.activeInvestments = [];
    component.allLoaded = true;
    fixture.detectChanges();
    const noInvestmentsEl = fixture.debugElement.query(By.css('div.dp__no_investments'));
    expect(noInvestmentsEl).toBeTruthy();
  });

  it('should create available defi products', () => {
    expect(component.createAvailableDefiProducts()).toBeInstanceOf(AvailableDefiProducts);
  });

  it('should create investment product', async () => {
    expect(await component.getInvestmentProduct({} as DefiProduct)).toBeInstanceOf(TwoPiProduct);
  });

  it('should create investment', async () => {
    expect(await component.createInvestment(investmentProductSpy, '0x')).toBeInstanceOf(TwoPiInvestment);
  });

  it('should get user investor score on ionViewWillEnter', async () => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    expect(apiUsuariosServiceSpy.getUser).toHaveBeenCalledTimes(1);
  });

  it('should render investor test card when user did the investor test', async () => {
    walletServiceSpy.walletExist.and.resolveTo(false);
    spyOn(component, 'calculateEarnings');
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const cardEl = fixture.debugElement.query(By.css('app-choose-investor-profile-card'));
    expect(cardEl.nativeElement.hasDoneInvestorTest).toBeTrue();
    expect(cardEl).toBeTruthy();
  });

  it('should render investor test card when user did not take the investor test', async () => {
    apiUsuariosServiceSpy.getUser.and.returnValue(of(testUserSpy));
    walletServiceSpy.walletExist.and.resolveTo(false);
    spyOn(component, 'calculateEarnings');
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const cardEl = fixture.debugElement.query(By.css('app-choose-investor-profile-card'));
    expect(cardEl.nativeElement.hasDoneInvestorTest).toBeFalse();
    expect(cardEl).toBeTruthy();
  });

  it('should render total invested correctly', async () => {
    spyOn(component, 'calculateEarnings');
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const totalInvestedEl = fixture.debugElement.query(By.css('.dp__amount__content__total-invested'));
    fixture.detectChanges();
    expect(component.totalInvested).toEqual(10.58354);
    expect(totalInvestedEl.nativeElement.innerHTML).toContain('10.58');
  });

  it('should render yields properly', fakeAsync(() => {
    spyOn(YieldCalculator.prototype, 'cumulativeYieldUSD').and.returnValue({ value: 12, token: 'USD' });
    spyOn(component, 'createInvestment').and.returnValue(investmentSpy);
    spyOn(component, 'createAvailableDefiProducts').and.returnValue(availableDefiProductsSpy);
    component.ionViewWillEnter();
    component.ionViewDidEnter();
    tick();
    fixture.detectChanges();
    expect(component.totalUsdYield).toEqual({ value: 12, token: 'USD' });
  }));
});
