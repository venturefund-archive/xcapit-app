import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewInvestmentPage } from './new-investment.page';

describe('NewInvestmentPage', () => {
  let component: NewInvestmentPage;
  let fixture: ComponentFixture<NewInvestmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewInvestmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewInvestmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
