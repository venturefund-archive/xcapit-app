import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AssetBalance } from '../../interfaces/asset-balance.interface';

import { WalletBalanceCardItemComponent } from './wallet-balance-card-item.component';

const balance: AssetBalance = {
  icon: 'assets/img/coins/ETH.svg',
  symbol: 'ETH',
  name: 'Ethereum',
  amount: 1,
  nativeTokenAmount: 1,
  nativeTokenSymbol: 'ETH',
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
      component.balance = balance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
