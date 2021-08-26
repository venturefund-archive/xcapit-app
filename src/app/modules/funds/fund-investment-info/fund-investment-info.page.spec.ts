import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundInvestmentInfoPage } from './fund-investment-info.page';

describe('FundInvestmentInfoPage', () => {
  let component: FundInvestmentInfoPage;
  let fixture: ComponentFixture<FundInvestmentInfoPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FundInvestmentInfoPage],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(FundInvestmentInfoPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
