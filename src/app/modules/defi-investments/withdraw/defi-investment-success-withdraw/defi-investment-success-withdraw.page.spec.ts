import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DefiInvestmentSuccessWithdrawPage } from './defi-investment-success-withdraw.page';

describe('DefiInvestmentSuccessWithdrawPage', () => {
  let component: DefiInvestmentSuccessWithdrawPage;
  let fixture: ComponentFixture<DefiInvestmentSuccessWithdrawPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DefiInvestmentSuccessWithdrawPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DefiInvestmentSuccessWithdrawPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
