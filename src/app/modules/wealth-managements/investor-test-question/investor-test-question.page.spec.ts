import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvestorTestQuestionPage } from './investor-test-question.page';

describe('InvestorTestQuestionPage', () => {
  let component: InvestorTestQuestionPage;
  let fixture: ComponentFixture<InvestorTestQuestionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvestorTestQuestionPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestorTestQuestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should show questions and answers')

  // it('should load all questions if there is no question key on route params')

  // it('should load the question in route params')

  // it('should load all questions and go to first when there is a question in route params but service does not have answers')

  // it('should load all questions and go to first when there is a question in route params but service does not have questions')
});
