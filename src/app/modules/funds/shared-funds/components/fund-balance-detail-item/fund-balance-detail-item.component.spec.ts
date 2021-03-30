import { CurrencyFormatPipe } from './../../pipes/currency-format/currency-format.pipe';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundBalanceDetailItemComponent } from './fund-balance-detail-item.component';
import { By } from '@angular/platform-browser';
import { DecimalPipe } from '@angular/common';
const testItem = {
  color: '#FABEA1',
  amount: '14.000000',
  value: '12.000000',
  ca: 'BTC',
};

describe('FundBalanceDetailItemComponent', () => {
  let component: FundBalanceDetailItemComponent;
  let fixture: ComponentFixture<FundBalanceDetailItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FundBalanceDetailItemComponent, CurrencyFormatPipe, DecimalPipe],
      imports: [IonicModule],
      providers: [CurrencyFormatPipe, DecimalPipe]
    }).compileComponents();

    fixture = TestBed.createComponent(FundBalanceDetailItemComponent);
    component = fixture.componentInstance;
    component.item = testItem;
    component.currency = 'BTC';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct values', () => {
    const amount = fixture.debugElement.query(By.css('div.amount'))
      .nativeElement.children[0].textContent;
    const value = fixture.debugElement.query(By.css('div.value')).nativeElement
      .children[0].textContent;
    const ca = fixture.debugElement.query(By.css('div.ca')).nativeElement
      .children[0].textContent;
    expect(amount).toContain(testItem.amount);
    expect(value).toContain(`${testItem.value} ${component.currency}`);
    expect(ca).toContain(testItem.ca);
  });
});
