import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DefiInvestmentWithdrawPage } from './defi-investment-withdraw.page';

describe('DefiInvestmentWithdrawPage', () => {
  let component: DefiInvestmentWithdrawPage;
  let fixture: ComponentFixture<DefiInvestmentWithdrawPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DefiInvestmentWithdrawPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DefiInvestmentWithdrawPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
