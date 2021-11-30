import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvestmentsTabPage } from './investments-tab.page';

describe('InvestmentsTabPage', () => {
  let component: InvestmentsTabPage;
  let fixture: ComponentFixture<InvestmentsTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentsTabPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentsTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
