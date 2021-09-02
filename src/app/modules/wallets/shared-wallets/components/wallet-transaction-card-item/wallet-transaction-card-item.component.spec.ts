import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletTransactionCardItemComponent } from './wallet-transaction-card-item.component';
import { WalletTransactionsService } from '../../../shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { TranslateModule } from '@ngx-translate/core';

const transaction = {
  icon: 'assets/img/wallet-transactions/received.svg',
  type: 'received',
  asset: 'ETH',
  from: '0x00000000000000000000000000',
  to: '0x00000000000000000000000001',
  value: '0.2',
  hash: '0x000000000000000000000000000000000000000000001',
  blockNumber: '0x00000001',
  erc721: false,
  rawContract: false,
  swap: {
    currencyIn: '',
    currencyOut: '',
    amountIn: null,
    amounOut: null,
  },
};

describe('WalletTransactionCardItemComponent', () => {
  let component: WalletTransactionCardItemComponent;
  let fixture: ComponentFixture<WalletTransactionCardItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WalletTransactionCardItemComponent],
        imports: [IonicModule, TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletTransactionCardItemComponent);
      component = fixture.componentInstance;
      component.transaction = transaction;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
