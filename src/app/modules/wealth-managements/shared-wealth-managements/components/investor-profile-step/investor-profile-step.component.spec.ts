import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvestorProfileStepComponent } from './investor-profile-step.component';

describe('InvestorProfileStepComponent', () => {
  let component: InvestorProfileStepComponent;
  let fixture: ComponentFixture<InvestorProfileStepComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InvestorProfileStepComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(InvestorProfileStepComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
