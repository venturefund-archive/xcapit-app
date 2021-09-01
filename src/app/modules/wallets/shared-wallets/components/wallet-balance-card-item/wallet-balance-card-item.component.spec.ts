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
};

describe('WalletBalanceCardItemComponent', () => {
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

  it('should hide balance if there was no price for coin', () => {
    component.balance = testBalances.withoutPrice;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('#balance-card'));
    expect(el).toBeNull();
  });
});
