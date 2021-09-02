import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AssetBalance } from '../../interfaces/asset-balance.interface';

import { WalletBalanceCardComponent } from './wallet-balance-card.component';

const balances: Array<AssetBalance> = [
  {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 1,
    usdAmount: 3000,
    usdSymbol: 'USD',
    walletAddress: 'testAddress',
  },
];

describe('WalletBalanceCardComponent', () => {
  let component: WalletBalanceCardComponent;
  let fixture: ComponentFixture<WalletBalanceCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WalletBalanceCardComponent],
        imports: [IonicModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletBalanceCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-wallet-balance-card-item when have balances', () => {
    component.balances = balances;
    fixture.detectChanges();
    const cardItemElement = fixture.debugElement.query(By.css('app-wallet-balance-card-item'));
    expect(cardItemElement).not.toBeNull();
  });

  it('should not render app-wallet-balance-card-item when not have balances', () => {
    component.balances = [];
    fixture.detectChanges();
    const cardItemElement = fixture.debugElement.query(By.css('app-wallet-balance-card-item'));
    expect(cardItemElement).toBeNull();
  });
});
