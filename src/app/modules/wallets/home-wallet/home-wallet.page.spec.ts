import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomeWalletPage } from './home-wallet.page';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { By } from '@angular/platform-browser';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

const coins: Coin[] = [
  {
    id: 1,
    name: 'coinTest',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: false,
    value: 'coinTest',
    network: 'ETH',
    rpc: 'http://testrpc.test',
  },
];

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
  let navControllerSpy: any;
  let walletServiceMock: any;
  let walletService: WalletService;

  beforeEach(
    waitForAsync(() => {
      walletServiceMock = {
        walletExist: () => Promise.resolve(true),
        balanceOf: (address, coin) => Promise.resolve('20'),
        addresses: { ETH: 'testAddress' },
      };
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [HomeWalletPage, TrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [
          TrackClickDirective,
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeWalletPage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      fixture.detectChanges();
      walletService = TestBed.inject(WalletService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if wallet exist on view will enter and there are a wallet', async () => {
    await component.ionViewWillEnter();
    expect(component.walletExist).toBe(true);
  });

  it('should check if wallet exist on view will enter and there are not a wallet', async () => {
    spyOn(walletService, 'walletExist').and.returnValue(Promise.resolve(false));
    await component.ionViewWillEnter();
    expect(component.walletExist).toBe(false);
  });

  it('should render app-wallets-subheader when walletExist is false', () => {
    component.walletExist = false;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__subheader'));
    expect(subheader).not.toBeNull();
  });

  it('should not render app-wallets-subheader when walletExist is true and have balance', () => {
    component.walletExist = true;
    component.balances = balances;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__subheader'));
    expect(subheader).toBeNull();
  });

  it('should not render app-wallet-balance-card when walletExist and have balances', () => {
    component.walletExist = true;
    component.balances = balances;
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).not.toBeNull();
  });

  it('should not render app-wallet-balance-card when walletExist and dont have balances', () => {
    component.walletExist = true;
    component.balances = [];
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).toBeNull();
  });

  it('should not render app-wallet-balance-card when walletExist and have balances', () => {
    component.walletExist = false;
    component.balances = balances;
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).toBeNull();
  });

  it('should get eth balance on view will enter', async () => {
    spyOn(walletService, 'walletExist').and.returnValue(Promise.resolve(true));
    component.coins = coins;
    const spyBalance = spyOn(walletService, 'balanceOf').and.returnValue(Promise.resolve('20'));
    fixture.detectChanges();
    await component.ionViewWillEnter();
    expect(component.walletExist).toBe(true);
    expect(component.walletAddress).toBe('testAddress');
    expect(spyBalance).toHaveBeenCalledWith('testAddress', 'coinTest');
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
});
