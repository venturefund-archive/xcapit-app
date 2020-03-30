import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundBalanceDetailItemComponent } from './fund-balance-detail-item.component';
import { By } from '@angular/platform-browser';
const testItem = {
  color: '#FABEA1',
  amount: '14.00',
  value: '12.00',
  ca: 'BTC'
};

describe('FundBalanceDetailItemComponent', () => {
  let component: FundBalanceDetailItemComponent;
  let fixture: ComponentFixture<FundBalanceDetailItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FundBalanceDetailItemComponent],
      imports: [IonicModule]
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
    expect(amount).toBe(testItem.amount);
    expect(value).toBe(`${testItem.value} ${component.currency}`);
    expect(ca).toBe(testItem.ca);
  });
});
