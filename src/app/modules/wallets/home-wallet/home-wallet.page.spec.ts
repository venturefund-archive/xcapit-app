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
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';

const testCoins = {
  test: [
    {
      id: 1,
      name: 'coinTest',
      logoRoute: '../../assets/img/coins/ETH.svg',
      last: false,
      value: 'coinTest',
      network: 'ERC20',
      chainId: 42,
      rpc: 'http://testrpc.test',
    },
  ],
  usdBalanceTest: [
    {
      id: 2,
      name: 'ETH - Ethereum',
      logoRoute: '../../assets/img/coins/ETH.svg',
      last: false,
      value: 'ETH',
      network: 'ETH',
      chainId: 42,
      rpc: 'http://testrpc.test',
    },
    {
      id: 6,
      name: 'RBTC - Smart Bitcoin',
      logoRoute: '../../assets/img/coins/RBTC.png',
      last: false,
      value: 'RBTC',
      network: 'RSK',
      chainId: 31,
      rpc: 'http://testrpc.test',
    },
    {
      id: 3,
      name: 'USDT - Tether',
      logoRoute: '../../assets/img/coins/USDT.svg',
      last: false,
      value: 'USDT',
      network: 'ETH',
      chainId: 42,
      rpc: 'http://testrpc.test',
      decimals: 6,
    },
  ],
};

const balances: Array<AssetBalance> = [
  {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'ETH - Ethereum',
    amount: 1,
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
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
        getPrices: of({ prices: { ETH: 3000, BTC: 50000, USDT: 1 } }),
        getNFTStatus: of({ status: 'claimed' }),
        createNFTRequest: of({}),
      });
      fakeWalletService = new FakeWalletService(Promise.resolve(true), Promise.resolve('20'), { ERC20: 'testAddress' });
      walletServiceSpy = fakeWalletService.createSpy();
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getAssestsSelected: Promise.resolve(testCoins.test),
        updateAssetsList: Promise.resolve(true),
      });

      TestBed.configureTestingModule({
        declarations: [HomeWalletPage, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule, ReactiveFormsModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: StorageService, useValue: storageServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeWalletPage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      component.allPrices = undefined;
      component.userCoins = testCoins.test;
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

  it('should show the total balance in USD on getWalletsBalances', async () => {
    fakeWalletService.modifyAttributes({
      ETH: 'testAddressEth',
      RSK: 'testAddressRsk',
    });
    component.userCoins = testCoins.usdBalanceTest;
    component.allPrices = { prices: { ETH: 3000, BTC: 50000, USDT: 1 } };
    const expectedBalance = 1060020;

    await component.getWalletsBalances();

    expect(component.totalBalanceWallet).toBe(expectedBalance);
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

  it('should show the total balance in USD on ionViewWillEnter', fakeAsync(() => {
    storageServiceSpy.getAssestsSelected.and.returnValue(Promise.resolve(testCoins.usdBalanceTest));
    fakeWalletService.modifyAttributes({
      ETH: 'testAddressEth',
      RSK: 'testAddressRsk',
    });
    const expectedBalance = 1060020;

    component.ionViewWillEnter();
    tick(350);

    expect(component.totalBalanceWallet).toBe(expectedBalance);
    flush();
  }));

  it('should show the equivalent of each coin balance in USD on getWalletsBalances', async () => {
    component.userCoins = testCoins.usdBalanceTest;
    fakeWalletService.modifyAttributes({
      ETH: 'testAddressEth',
      RSK: 'testAddressRsk',
    });
    component.allPrices = { prices: { ETH: 3000, BTC: 50000, USDT: 1 } };

    const expectedBalanceRBTC = 1000000;
    const expectedBalanceETH = 60000;
    const expectedBalanceUSDT = 20;

    await component.getWalletsBalances();

    expect(component.balances[0].usdAmount).toBe(expectedBalanceETH);
    expect(component.balances[1].usdAmount).toBe(expectedBalanceRBTC);
    expect(component.balances[2].usdAmount).toBe(expectedBalanceUSDT);
  });

  it('should not sum USD balances if coin price was not found on ionViewWillEnter', fakeAsync(() => {
    storageServiceSpy.getAssestsSelected.and.returnValue(Promise.resolve(testCoins.usdBalanceTest));
    fakeWalletService.modifyAttributes({
      ETH: 'testAddressEth',
      RSK: 'testAddressRsk',
    });
    apiWalletServiceSpy.getPrices.and.returnValue(of({ prices: { ETH: null, BTC: null, USDT: 1 } }));
    const expectedBalance = 20;

    component.ionViewWillEnter();
    tick(350);

    expect(component.totalBalanceWallet).toBe(expectedBalance);
  }));

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
