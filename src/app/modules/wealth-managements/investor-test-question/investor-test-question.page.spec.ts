import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { InvestorTestQuestionPage } from './investor-test-question.page';

fdescribe('InvestorTestQuestionPage', () => {
  let component: InvestorTestQuestionPage;
  let fixture: ComponentFixture<InvestorTestQuestionPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let activatedRouteMock: any;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      activatedRouteMock = {
        snapshot: {
          paramMap: {
            get: (param: string) => 'testParam',
          },
        },
      };

      TestBed.configureTestingModule({
        declarations: [InvestorTestQuestionPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(InvestorTestQuestionPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return 50% when user is on question 2 out of 4 on progress getter', () => {
    component.currentQuestionNumber = 2;
    component.totalNumberOfQuestions = 4;
    expect(component.progress).toEqual('50%');
  });

  it('should return 100% when user is on question 4 out of 4 on progress getter', () => {
    component.currentQuestionNumber = 4;
    component.totalNumberOfQuestions = 4;
    expect(component.progress).toEqual('100%');
  });

  it('should return empty string when user is on question 5 out of 4 on progress getter', () => {
    component.currentQuestionNumber = 5;
    component.totalNumberOfQuestions = 4;
    expect(component.progress).toEqual('');
  });

  it('should return empty string when user is on question 0 out of 4 on progress getter', () => {
    component.currentQuestionNumber = 0;
    component.totalNumberOfQuestions = 4;
    expect(component.progress).toEqual('');
  });

  it('should return true when user is on question 4 out of 4 on isLastQuestion getter', () => {
    component.currentQuestionNumber = 4;
    component.totalNumberOfQuestions = 4;
    expect(component.isLastQuestion).toBeTrue();
  });

  it('should return false when user is on question 1 out of 4 on isLastQuestion getter', () => {
    component.currentQuestionNumber = 1;
    component.totalNumberOfQuestions = 4;
    expect(component.isLastQuestion).toBeFalse();
  });

  it('should return false when user is on question 5 out of 4 on isLastQuestion getter', () => {
    component.currentQuestionNumber = 5;
    component.totalNumberOfQuestions = 4;
    expect(component.isLastQuestion).toBeFalse();
  });

  it('should return false when user is on question 0 out of 4 on isLastQuestion getter', () => {
    component.currentQuestionNumber = 0;
    component.totalNumberOfQuestions = 4;
    expect(component.isLastQuestion).toBeFalse();
  });

  it('should get question key on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(component.currentQuestionKey).toEqual('testParam');
  });

  // it('should show questions and answers')

  // it('should load all questions if there is no question key on route params')

  // it('should load the question in route params')

  // it('should load all questions and go to first when there is a question in route params but service does not have answers')

  // it('should load all questions and go to first when there is a question in route params but service does not have questions')
});
