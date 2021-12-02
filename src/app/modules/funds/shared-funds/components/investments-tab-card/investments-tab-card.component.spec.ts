import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvestmentsTabCardComponent } from './investments-tab-card.component';

describe('InvestmentsTabCardComponent', () => {
  let component: InvestmentsTabCardComponent;
  let fixture: ComponentFixture<InvestmentsTabCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentsTabCardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentsTabCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
