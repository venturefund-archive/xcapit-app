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

  it('should render skeleton when quoteFee value is not available', () => {
    component.quoteFee.value = undefined;
    expect(fixture.debugElement.query(By.css('.skeleton ion-skeleton-text'))).toBeTruthy();
  });

  it('should render advice div when you dont have necessary fee', () => {
    component.fee.value = 2;
    component.balance = 1;
    component.quoteFee.value = 0.0017;
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div.tf__fee__qty_and_advice__funds-advice'));
    expect(divEl).toBeTruthy();
  });

  it('should not render advice div when you dont have necessary fee', () => {
    component.fee.value = 0.0017;
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div.tf__fee__qty_and_advice__funds-advice'));
    expect(divEl).toBeFalsy();
  });

  it('should not render skeleton when quoteFee value is available', async () => {
    component.quoteFee.value = 0.017;
    fixture.detectChanges();
    await fixture.whenStable();
    const skeletonEl = fixture.debugElement.query(By.css('.skeleton ion-skeleton-text'));
    expect(skeletonEl).toBeFalsy();
    
  });

});
