import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvestmentsTabCardComponent } from './investments-tab-card.component';

describe('InvestmentsTabCardComponent', () => {
  let component: InvestmentsTabCardComponent;
  let fixture: ComponentFixture<InvestmentsTabCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InvestmentsTabCardComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(InvestmentsTabCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // TODO: Complete tests
  it('should navigate to option page when Navigate to Option Button clicked');

  it('should call trackEvent on trackService when Navigate to Option Button clicked');
});
