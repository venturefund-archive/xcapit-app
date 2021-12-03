import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvestmentsTabPage } from './investments-tab.page';

describe('InvestmentsTabPage', () => {
  let component: InvestmentsTabPage;
  let fixture: ComponentFixture<InvestmentsTabPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InvestmentsTabPage],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(InvestmentsTabPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Complete tests
  it('should navigate to FAQs Page when How Investments Work Button clicked');

  it('should call trackEvent on trackService when How Investments Work Button clicked');
});
