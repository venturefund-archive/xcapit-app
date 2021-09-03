import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AssetBalance } from '../../interfaces/asset-balance.interface';

import { WalletBalanceCardItemComponent } from './wallet-balance-card-item.component';

const testBalances: any = {
  withPrice: {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 1,
    usdAmount: 3000,
    usdSymbol: 'USD',
  },
  withoutPrice: {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 1,
    usdAmount: 0,
    usdSymbol: 'USD',
  },
  withoutBalance: {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 1,
    usdAmount: undefined,
    usdSymbol: 'USD',
  },
  zeroBalance: {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 0,
    usdAmount: 0,
    usdSymbol: 'USD',
  },
};

fdescribe('WalletBalanceCardItemComponent', () => {
  let component: WalletBalanceCardItemComponent;
  let fixture: ComponentFixture<WalletBalanceCardItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WalletBalanceCardItemComponent],
        imports: [IonicModule],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletBalanceCardItemComponent);
      component = fixture.componentInstance;
      component.balance = testBalances.withPrice;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false on hasPrice if there was no price for coin', () => {
    component.balance = testBalances.withoutPrice;
    const value = component.hasPrice();
    expect(value).toBeFalse();
  });

  it('should return false on hasPrice if there was no usd balance', () => {
    component.balance = testBalances.withoutBalance;
    const value = component.hasPrice();
    expect(value).toBeFalse();
  });

  it('should return true on hasPrice if there was price for coin', () => {
    component.balance = testBalances.withPrice;
    const value = component.hasPrice();
    expect(value).toBeTrue();
  });

  it('should return true on hasPrice if wallet has balance zero', () => {
    component.balance = testBalances.zeroBalance;
    const value = component.hasPrice();
    expect(value).toBeTrue();
  });
});
