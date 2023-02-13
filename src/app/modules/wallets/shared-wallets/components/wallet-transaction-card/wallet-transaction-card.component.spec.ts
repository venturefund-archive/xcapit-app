import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { WalletTransactionCardComponent } from './wallet-transaction-card.component';
import { NativeTransfer } from '../../models/transfer/native-transfer/native-transfer';
import { rawTransfer } from '../../fixtures/covalent-transfers.fixture';
import { rawMATICData } from '../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { TranslateModule } from '@ngx-translate/core';

describe('WalletTransactionCardComponent', () => {
  const transfer = new NativeTransfer(rawTransfer, rawMATICData, '');

  const transfers = [transfer, transfer, transfer, transfer];

  let component: WalletTransactionCardComponent;
  let fixture: ComponentFixture<WalletTransactionCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WalletTransactionCardComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletTransactionCardComponent);
    component = fixture.componentInstance;
    component.transfers = transfers;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-wallet-transaction-card-item when have transactions', () => {
    component.transfers = [new NativeTransfer(rawTransfer, rawMATICData, '')];
    component.ngOnInit();
    fixture.detectChanges();
    const cardItemElement = fixture.debugElement.query(By.css('app-wallet-transaction-card-item'));
    expect(cardItemElement).not.toBeNull();
  });

  it('should not render app-wallet-transaction-card-item when not have transactions', () => {
    component.transfers = [];
    component.ngOnInit();
    fixture.detectChanges();
    const cardItemElement = fixture.debugElement.query(By.css('app-wallet-transaction-card-item'));
    expect(cardItemElement).toBeNull();
  });

  it('should not render accordion button when number of transactions less than 4', () => {
    component.transfers = [transfer];
    component.ngOnInit();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Open Accordion"]'));
    expect(buttonEl).toBeFalsy();
  });

  it('should expand accordion when Open Accordion button is clicked', () => {
    component.ngOnInit();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Open Accordion"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(component.openedAccordion).toBeTrue();
    expect(component.accordionGroup.value).toBe('transfers');
  });

  it('should collapse accordion when Close Accordion button is clicked', () => {
    component.accordionGroup.value = 'transfers';
    component.openedAccordion = true;
    component.ngOnInit();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Close Accordion"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(component.openedAccordion).toBeFalse();
    expect(component.accordionGroup.value).toBeFalsy();
  });
});
