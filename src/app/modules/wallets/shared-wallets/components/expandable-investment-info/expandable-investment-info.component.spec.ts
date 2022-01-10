import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExpandableInvestmentInfoComponent } from './expandable-investment-info.component';

describe('ExpandableInvestmentInfoComponent', () => {
  let component: ExpandableInvestmentInfoComponent;
  let fixture: ComponentFixture<ExpandableInvestmentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandableInvestmentInfoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandableInvestmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
