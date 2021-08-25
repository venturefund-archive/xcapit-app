import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { WalletBalanceCardItemComponent } from './wallet-balance-card-item.component';

const testBalances = {
  withPrice: {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 1,
    usdAmount: 3000,
    usdSymbol: 'USD',
    walletAddress: 'testAddress',
  },
  withoutPrice: {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 1,
    usdAmount: -1,
    usdSymbol: 'USD',
    walletAddress: 'testAddress',
  },
  zeroBalance: {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 0,
    usdAmount: 0,
    usdSymbol: 'USD',
    walletAddress: 'testAddress',
  },
};

describe('WalletBalanceCardItemComponent', () => {
  let component: WalletBalanceCardItemComponent;
  let fixture: ComponentFixture<WalletBalanceCardItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WalletBalanceCardItemComponent],
        imports: [TranslateModule.forRoot(), IonicModule],
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

  it('should show a message if coin price was not found', () => {
    component.balance = testBalances.withoutPrice;
    fixture.detectChanges();

    const balance = fixture.debugElement.query(By.css('#usd-balance'));
    const error = fixture.debugElement.query(By.css('#error-message'));

    expect(balance).toBeNull();
    expect(error).not.toBeNull();
  });

  it('should show USD balance if coin price was found', () => {
    component.balance = testBalances.withPrice;
    fixture.detectChanges();

    const balance = fixture.debugElement.query(By.css('#usd-balance'));
    const error = fixture.debugElement.query(By.css('#error-message'));

    expect(balance).not.toBeNull();
    expect(error).toBeNull();
  });

  it('should show USD balance if balace is zero', () => {
    component.balance = testBalances.zeroBalance;
    fixture.detectChanges();

    const balance = fixture.debugElement.query(By.css('#usd-balance'));
    const error = fixture.debugElement.query(By.css('#error-message'));

    expect(balance).not.toBeNull();
    expect(error).toBeNull();
  });
});
