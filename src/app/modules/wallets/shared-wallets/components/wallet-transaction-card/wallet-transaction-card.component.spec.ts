import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { WalletTransactionCardComponent } from './wallet-transaction-card.component';

const transaction = [
  {
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
      amountOut: null,
    },
  },
];

describe('WalletTransactionCardComponent', () => {
  let component: WalletTransactionCardComponent;
  let fixture: ComponentFixture<WalletTransactionCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WalletTransactionCardComponent],
        imports: [IonicModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletTransactionCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-wallet-transaction-card-item when have transactions', () => {
    component.transactions = transaction;
    fixture.detectChanges();
    const cardItemElement = fixture.debugElement.query(By.css('app-wallet-transaction-card-item'));
    expect(cardItemElement).not.toBeNull();
  });

  it('should not render app-wallet-transaction-card-item when not have transactions', () => {
    component.transactions = [];
    fixture.detectChanges();
    const cardItemElement = fixture.debugElement.query(By.css('app-wallet-transaction-card-item'));
    expect(cardItemElement).toBeNull();
  });
});
