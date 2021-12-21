import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomeWalletPage } from './home-wallet.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { By } from '@angular/platform-browser';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { of } from 'rxjs';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { WalletBalanceService } from '../shared-wallets/services/wallet-balance/wallet-balance.service';
import { RefreshTimeoutService } from 'src/app/shared/services/refresh-timeout/refresh-timeout.service';

const balances: Array<AssetBalance> = [
  {
    icon: 'assets/img/coins/LINK.svg',
    symbol: 'LINK',
    name: 'LINK - Chainlink',
    amount: 0.005,
    usdAmount: 120,
    usdSymbol: 'USD',
  },
  {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'ETH - Ethereum',
    amount: 1,
    usdAmount: 2000,
    usdSymbol: 'USD',
  },
  {
    icon: 'assets/img/coins/USDT.svg',
    symbol: 'USDT',
    name: 'USDT - Tether',
    amount: 2,
    usdAmount: 3000,
    usdSymbol: 'USD',
  },
];

describe('HomeWalletPage', () => {
  let component: HomeWalletPage;
  let fixture: ComponentFixture<HomeWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HomeWalletPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;
  let refreshTimeoutServiceSpy: jasmine.SpyObj<RefreshTimeoutService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getNFTStatus: of({ status: 'claimed' }),
        createNFTRequest: of({}),
      });

      fakeWalletService = new FakeWalletService(true);
      walletServiceSpy = fakeWalletService.createSpy();

      walletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', {
        getWalletsBalances: Promise.resolve(balances),
        getUsdTotalBalance: Promise.resolve(5120),
      });

      refreshTimeoutServiceSpy = jasmine.createSpyObj('RefreshTimeoutService', {
        isAvailable: true,
        lock: of(),
      });

      TestBed.configureTestingModule({
        declarations: [HomeWalletPage, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule, ReactiveFormsModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: WalletBalanceService, useValue: walletBalanceServiceSpy },
          { provide: RefreshTimeoutService, useValue: refreshTimeoutServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeWalletPage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if wallet exist on view will enter and there are a wallet', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.walletExist).toBe(true);
  });

  it('should check if wallet exist on view will enter and there are not a wallet', async () => {
    walletServiceSpy.walletExist.and.returnValue(Promise.resolve(false));
    await component.ionViewWillEnter();
    expect(component.walletExist).toBe(false);
  });

  it('should not render app-wallets-subheader when walletExist is true', () => {
    component.walletExist = true;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__subheader'));
    expect(subheader).toBeNull();
  });

  it('should render app-wallets-buttons-subheader when walletExist is true', () => {
    component.walletExist = true;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__overlap_buttons'));
    expect(subheader).not.toBeNull();
  });

  it('should not render app-wallets-buttons-subheader when walletExist is false', () => {
    component.walletExist = false;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__overlap_buttons'));
    expect(subheader).toBeNull();
  });

  it('should render app-wallet-balance-card when walletExist and there are balances', () => {
    component.walletExist = true;
    component.balances = balances;
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).not.toBeNull();
  });

  it('should not render app-wallet-balance-card when walletExist is true but there are not balances', () => {
    component.walletExist = true;
    component.balances = [];
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).toBeNull();
  });

  it('should not render app-wallet-balance-card when walletExist is false and have balances', () => {
    component.walletExist = false;
    component.balances = balances;
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).toBeNull();
  });

  it('should get balance when wallet exist and there is balance', async () => {
    component.alreadyInitialized = false;
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.totalBalanceWallet).toEqual(5120);
  });

  it('should get zero balance when wallet exist and there is not balance', async () => {
    component.alreadyInitialized = false;
    walletBalanceServiceSpy.getUsdTotalBalance.and.resolveTo(0);
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.totalBalanceWallet).toEqual(0);
  });

  it('should get zero balance when wallet not exist', async () => {
    component.alreadyInitialized = false;
    fakeWalletService.modifyReturns(false, null);
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.totalBalanceWallet).toEqual(0);
  });

  it('should render app-wallet-balance-card if wallet exist and there are balances', async () => {
    component.alreadyInitialized = false;
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const appWalletBalance = fixture.debugElement.query(By.css('app-wallet-balance-card '));
    expect(appWalletBalance).toBeTruthy();
  });

  it('should not render app-wallet-balance-card if wallet not exist', async () => {
    component.alreadyInitialized = false;
    fakeWalletService.modifyReturns(false, null);
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const appWalletBalance = fixture.debugElement.query(By.css('app-wallet-balance-card '));
    expect(appWalletBalance).toBeNull();
  });

  it('should call getNFTStatus, encryptedWalletExist and alreadyInitialized is set to false on refresh', async () => {
    const spyEncryptedWallet = spyOn(component, 'encryptedWalletExist');
    await component.refresh({ target: { complete: () => null } });
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(apiWalletServiceSpy.getNFTStatus).toHaveBeenCalledTimes(1);
    expect(component.alreadyInitialized).toBe(false);
    expect(spyEncryptedWallet).toHaveBeenCalledTimes(1);
  });

  it('should call appTrackEvent on trackService when Import Wallet clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Import Wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate when goToRecoveryWallet is called', async () => {
    component.goToRecoveryWallet();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/create-first/disclaimer', 'import']);
  });

  it('should render selected tab', async () => {
    component.walletExist = true;
    component.balances = balances;
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(fixture.debugElement.query(By.css('.wt__balance'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.wt__nfts'))).not.toBeTruthy();
    component.segmentsForm.patchValue({ tab: 'nft' });
    fixture.debugElement.query(By.css('ion-segment-button[value="nft"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(fixture.debugElement.query(By.css('ion-segment-button[value="nft"]>ion-label.active_tab'))).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('ion-segment-button[value="assets"]>ion-label.active_tab'))
    ).not.toBeTruthy();
    expect(fixture.debugElement.query(By.css('.wt__balance'))).not.toBeTruthy();
    expect(fixture.debugElement.query(By.css('.wt__nfts'))).toBeTruthy();
  });

  it('should request the nft and update the nft status to claimed when claim event is received', () => {
    component.segmentsForm.patchValue({ tab: 'nft' });
    component.nftStatus = 'unclaimed';
    component.walletExist = true;
    fixture.detectChanges();
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getPrices: of({ prices: { ETH: 3000, BTC: 50000, USDT: 1 } }),
      getNFTStatus: of({ status: 'claimed' }),
      createNFTRequest: of({}),
    });
    const claimNFTCardComponent = fixture.debugElement.query(By.css('app-nft-card'));
    claimNFTCardComponent.triggerEventHandler('nftRequest', null);
    fixture.detectChanges();
    expect(component.nftStatus).toEqual('claimed');
  });

  it('should render nft card when user have wallet and nft on it', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    component.segmentsForm.patchValue({ tab: 'nft' });
    component.nftStatus = 'delivered';
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const nftEl = fixture.debugElement.query(By.css('app-nft-card'));
    expect(nftEl).toBeTruthy();
  });

  it('should not render nft card when user doesnt have wallet', async () => {
    fakeWalletService.modifyReturns(Promise.resolve(false), Promise.resolve('20'));
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    component.segmentsForm.patchValue({ tab: 'nft' });
    component.nftStatus = 'delivered';
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const nftEl = fixture.debugElement.query(By.css('app-nft-card'));
    expect(nftEl).toBeFalsy();
  });
});
