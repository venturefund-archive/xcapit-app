import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomeWalletPage } from './home-wallet.page';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AssetBalance } from '../shared-wallets/interfaces/asset-balance.interface';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';

const balances: Array<AssetBalance> = [
  {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 1,
    usdAmount: 3000,
    usdSymbol: 'USD',
  },
];

describe('HomeWalletPage', () => {
  let component: HomeWalletPage;
  let fixture: ComponentFixture<HomeWalletPage>;
  let navControllerSpy: any;
  let walletService: WalletService;
  let walletServiceMock: any;

  beforeEach(
    waitForAsync(() => {
      walletServiceMock = {
        balanceOf: (address) => Promise.resolve('20'),
      };
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [HomeWalletPage],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      walletService = TestBed.inject(WalletService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-wallets-subheader when haveWallets is false', () => {
    component.haveWallets = false;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__subheader'));
    expect(subheader).not.toBeNull();
  });

  it('should not render app-wallets-subheader when haveWallets is true', () => {
    component.haveWallets = true;
    fixture.detectChanges();
    const subheader = fixture.debugElement.query(By.css('.wt__subheader'));
    expect(subheader).toBeNull();
  });

  it('should not render app-wallet-balance-card when haveWallets and have balances', () => {
    component.haveWallets = true;
    component.balances = balances;
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).not.toBeNull();
  });

  it('should not render app-wallet-balance-card when haveWallets and dont have balances', () => {
    component.haveWallets = true;
    component.balances = [];
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).toBeNull();
  });

  it('should not render app-wallet-balance-card when haveWallets and have balances', () => {
    component.haveWallets = false;
    component.balances = balances;
    fixture.detectChanges();
    const balanceElement = fixture.debugElement.query(By.css('.wt__balance'));
    expect(balanceElement).toBeNull();
  });

  it('should get eth balance on view will enter', () => {
    const spy = spyOn(walletService, 'balanceOf').and.returnValue(Promise.resolve('20'));
    component.walletAddress = 'testAddress';
    fixture.detectChanges();
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledWith('testAddress');
    expect((component.balances[0].amount = parseFloat('20')));
  });
});
