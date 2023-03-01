import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TwoPiApi } from '../../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { Vault } from '@2pi-network/sdk';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { NewInvestmentPage } from './new-investment.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FakeFeatureFlagDirective } from 'src/testing/fakes/feature-flag-directive.fake.spec';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import { of } from 'rxjs';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { WalletBackupService } from 'src/app/modules/wallets/shared-wallets/services/wallet-backup/wallet-backup.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TokenOperationDataService } from 'src/app/modules/fiat-ramps/shared-ramps/services/token-operation-data/token-operation-data.service';

describe('NewInvestmentPage', () => {
  let component: NewInvestmentPage;
  let fixture: ComponentFixture<NewInvestmentPage>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let twoPiApiSpy: jasmine.SpyObj<TwoPiApi>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<NewInvestmentPage>;
  let investmentDataServiceSpy: jasmine.SpyObj<InvestmentDataService>;
  let dynamicPriceFactorySpy: jasmine.SpyObj<DynamicPriceFactory>;
  let dynamicPriceSpy: jasmine.SpyObj<DynamicPrice>;
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;
  let coinsSpy: jasmine.SpyObj<Coin>[];
  let walletBackupServiceSpy: jasmine.SpyObj<WalletBackupService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;

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

const noMoonpayVault = {
  apy: 0.227843965358873,
  balances: [],
  contract_address: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38',
  deposits: [],
  identifier: 'no_moonpay_token',
  pid: 1,
  token: 'NM',
  token_address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
  tvl: 1301621680000,
} as Vault;

const no_moonpay_token = {
  id: 9,
  name: 'NO MOONPAY - NM Coin',
  logoRoute: 'assets/img/coins/NM.png',
  last: false,
  value: 'NM',
  network: 'MATIC',
  chainId: 80001,
  rpc: 'http://testrpc.text/',
  decimals: 6,
  symbol: 'NMUSDT',
};

  beforeEach(
    waitForAsync(() => {
      investmentDataServiceSpy = jasmine.createSpyObj(
        'InvestmentDataService',
        {},
        {
          amount: 20,
          quoteAmount: 20,
          investment: {},
        }
      );
      tokenOperationDataServiceSpy = jasmine.createSpyObj('TokenOperationDataService',{
        set: {}
      },{
        tokenOperationData: {}
      })
      fakeActivatedRoute = new FakeActivatedRoute({ vault: 'polygon_usdc', mode: 'invest' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();

      dynamicPriceSpy = jasmine.createSpyObj('DynamicPrice', { value: of(2) });

      dynamicPriceFactorySpy = jasmine.createSpyObj('DynamicPriceFactory', {
        new: dynamicPriceSpy,
      });

      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();

      twoPiApiSpy = jasmine.createSpyObj('TwoPiApi', {
        vaults: Promise.resolve([testVault]),
        vault: Promise.resolve(testVault),
      });

      coinsSpy = [
        jasmine.createSpyObj(
          'Coin',
          {},
          { name: 'USDC - USD Coin', value: 'USDC', network: 'MATIC', moonpayCode: 'usdc_polygon' }
        ),
        jasmine.createSpyObj('Coin', {}, { name: 'MATIC', value: 'MATIC', network: 'MATIC', native: true }),
      ];

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
        getCoins: coinsSpy,
      });

      walletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', {
        balanceOf: Promise.resolve(2),
      });

      ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
        get: Promise.resolve(false),
        set: Promise.resolve(),
      });

      walletBackupServiceSpy = jasmine.createSpyObj('WalletBackupService', {
        presentModal: Promise.resolve('skip'),
      });

      TestBed.configureTestingModule({
        declarations: [NewInvestmentPage, FakeTrackClickDirective, FakeFeatureFlagDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: TwoPiApi, useValue: twoPiApiSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: InvestmentDataService, useValue: investmentDataServiceSpy },
          { provide: DynamicPriceFactory, useValue: dynamicPriceFactorySpy },
          { provide: WalletBalanceService, useValue: walletBalanceServiceSpy },
          { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
          { provide: WalletBackupService, useValue: walletBackupServiceSpy },
          { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(NewInvestmentPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent when ux_invest_continue button is clicked', async () => {
    await component.ionViewDidEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_invest_continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render properly button of component', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const buttonEl = fixture.debugElement.query(By.css('ion-label[name="go_to_buy"'));
    expect(buttonEl).toBeTruthy();
  });

  it('should not render moonpay text and button when token is not on moonpay', async () => {
    fakeActivatedRoute.modifySnapshotParams({ vault: 'no_moonpay_token', mode: 'invest' });
    twoPiApiSpy.vault.and.resolveTo(noMoonpayVault);
    apiWalletServiceSpy.getCoins.and.returnValue([no_moonpay_token]);
    await component.ionViewDidEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('div[class="ni__footer__text"]'));
    expect(buttonEl).toBeNull();
  });

  it('should navigate to buy conditions page when go_to_buy button is clicked and conditionsPurchasesAccepted if not exist in the storage', async () => {
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const buttonEl = fixture.debugElement.query(By.css('ion-label[name="go_to_buy"'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/buy-conditions']);
    expect(tokenOperationDataServiceSpy.tokenOperationData).not.toBeNull();
  });

  it('should navigate to select provider page when go_to_buy button is clicked and conditionsPurchasesAccepted if exist in the storage', async () => {
    ionicStorageServiceSpy.get.and.resolveTo(true);
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    walletBackupServiceSpy.presentModal.and.resolveTo('skip')
    const buttonEl = fixture.debugElement.query(By.css('ion-label[name="go_to_buy"'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(walletBackupServiceSpy.presentModal).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/select-provider']);
    expect(tokenOperationDataServiceSpy.tokenOperationData).not.toBeNull();
  });

  it('should not navigate when user click on backup wallet inside modal', async () => {
    walletBackupServiceSpy.presentModal.and.resolveTo('backup')
    await component.ionViewDidEnter();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const buttonEl = fixture.debugElement.query(By.css('ion-label[name="go_to_buy"'));
    buttonEl.nativeElement.click();
    await fixture.whenStable();
    expect(walletBackupServiceSpy.presentModal).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
  });

  it('should save amount and redirect if form is valid', fakeAsync( () => {
    walletBalanceServiceSpy.balanceOf.and.resolveTo(30);
    component.ionViewDidEnter();
    tick();
    component.form.patchValue({ amount: 20, quoteAmount: 20 });
    tick(550);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_invest_continue"]')).nativeElement.click();
    tick();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/defi/new/confirmation', 'invest']);
  }));

  it('should not save amount nor redirect if form is not valid', async () => {
    await component.ionViewDidEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_invest_continue"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
  });

  it('should correctly display the header and label when user is investing for the first time', async () => {
    await component.ionViewDidEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('ion-title'));
    expect(titleEl.nativeElement.innerHTML).toContain('defi_investments.new.header');
    expect(component.labelText).toEqual('defi_investments.new.amount_to_invest');
  });

  it('should correctly display the header and label when user is adding funds to the investment', async () => {
    fakeActivatedRoute.modifySnapshotParams({ vault: 'polygon_usdc', mode: 'add' });
    await component.ionViewDidEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('ion-title'));
    expect(titleEl.nativeElement.innerHTML).toContain('defi_investments.add.header');
    expect(component.labelText).toEqual('defi_investments.add.amount_to_add');
  });

  it('should unsubscribe when leave', () => {
    const nextSpy = spyOn(component.destroy$, 'next');
    const completeSpy = spyOn(component.destroy$, 'complete');
    component.ionViewWillLeave();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
});
