import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { WalletTransactionCardComponent } from './wallet-transaction-card.component';
import { NativeTransfer } from '../../models/transfer/native-transfer/native-transfer';
import { rawTransfer } from '../../fixtures/covalent-transfers.fixture';
import { rawMATICData } from '../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data';

fdescribe('WalletTransactionCardComponent', () => {
  let component: WalletTransactionCardComponent;
  let fixture: ComponentFixture<WalletTransactionCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WalletTransactionCardComponent],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletTransactionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-wallet-transaction-card-item when have transactions', () => {
    component.transfers = [new NativeTransfer(rawTransfer, rawMATICData, '')];
    fixture.detectChanges();
    const cardItemElement = fixture.debugElement.query(By.css('app-wallet-transaction-card-item'));
    expect(cardItemElement).not.toBeNull();
  });

  it('should not render app-wallet-transaction-card-item when not have transactions', () => {
    component.transfers = [];
    fixture.detectChanges();
    const cardItemElement = fixture.debugElement.query(By.css('app-wallet-transaction-card-item'));
    expect(cardItemElement).toBeNull();
  });
});
