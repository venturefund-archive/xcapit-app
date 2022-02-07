import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DefiInvestmentWithdrawComponent } from './defi-investment-withdraw.component';

describe('DefiInvestmentWithdrawComponent', () => {
  let component: DefiInvestmentWithdrawComponent;
  let fixture: ComponentFixture<DefiInvestmentWithdrawComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DefiInvestmentWithdrawComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DefiInvestmentWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
