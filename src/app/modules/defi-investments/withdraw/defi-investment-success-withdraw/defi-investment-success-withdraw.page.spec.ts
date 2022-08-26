import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DefiInvestmentSuccessWithdrawPage } from './defi-investment-success-withdraw.page';

describe('DefiInvestmentSuccessWithdrawPage', () => {
  let component: DefiInvestmentSuccessWithdrawPage;
  let fixture: ComponentFixture<DefiInvestmentSuccessWithdrawPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DefiInvestmentSuccessWithdrawPage],
        imports: [IonicModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(DefiInvestmentSuccessWithdrawPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data on will enter', () => {
    component.ionViewWillEnter();
    expect(component.data).toBeTruthy();
  });
});