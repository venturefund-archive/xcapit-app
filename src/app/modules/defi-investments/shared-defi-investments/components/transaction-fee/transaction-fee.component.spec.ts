import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { TransactionFeeComponent } from './transaction-fee.component';

describe('TransactionFeeComponent', () => {
  let component: TransactionFeeComponent;
  let fixture: ComponentFixture<TransactionFeeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TransactionFeeComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(TransactionFeeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render skeleton when  fee value is not available', async () => {
    component.fee.value = undefined;
    expect(fixture.debugElement.query(By.css('.skeleton'))).toBeTruthy();
  });
  it('should render advice div when you dont have necessary fee', async () => {
    component.fee.value = 0.0017;
    component.isNegativeBalance = true;
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div.tf__fee__qty_and_advice__funds-advice'));
    expect(divEl).toBeTruthy();
  });
  it('should not render advice div when you dont have necessary fee', async () => {
    component.fee.value = 0.0017;
    component.isNegativeBalance = false;
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div.tf__fee__qty_and_advice__funds-advice'));
    expect(divEl).toBeFalsy();
  });
  it('should not render skeleton when fee value is available', async () => {
    component.fee.value = 0.017;
    expect(fixture.debugElement.query(By.css('.skeleton'))).toBeTruthy();
  });
});
