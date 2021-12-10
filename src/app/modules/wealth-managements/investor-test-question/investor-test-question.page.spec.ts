import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { InvestorTestService } from '../shared-wealth-managements/services/investor-test/investor-test.service';

import { InvestorTestQuestionPage } from './investor-test-question.page';

const testQuestions = {
  Pregunta2: {
    text: 'Que tan arriesgado sos?',
    options: {
      opcion1: { text: 'Me asustan las cachorros', points: 1 },
      opcion2: { text: 'Mas o menos', points: 2 },
      opcion3: { text: 'Me tiro a la pileta sin agua', points: 3 },
    },
  },
  Pregunta1: {
    text: 'blablabla',
    options: {
      opcion1: { text: 'blablabla', points: 1 },
      opcion2: { text: 'blablabla', points: 2 },
      opcion3: { text: 'blablabla', points: 3 },
    },
  },
  Pregunta3: {
    text: 'blablabla',
    options: {
      opcion1: { text: 'blablabla', points: 1 },
      opcion2: { text: 'blablabla', points: 2 },
      opcion3: { text: 'blablabla', points: 3 },
    },
  },
  Pregunta4: {
    text: 'blablabla',
    options: {
      opcion1: { text: 'blablabla', points: 1 },
      opcion2: { text: 'blablabla', points: 2 },
    },
  },
  Pregunta5: {
    text: 'blablabla',
    options: {
      opcion1: { text: 'blablabla', points: 1 },
      opcion2: { text: 'blablabla', points: 2 },
      opcion3: { text: 'blablabla', points: 3 },
    },
  },
};

fdescribe('InvestorTestQuestionPage', () => {
  let component: InvestorTestQuestionPage;
  let fixture: ComponentFixture<InvestorTestQuestionPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let activatedRouteMock: any;
  let investorTestServiceSpy: jasmine.SpyObj<InvestorTestService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      activatedRouteMock = {
        snapshot: {
          paramMap: {
            get: (param: string) => '1',
          },
        },
      };

      investorTestServiceSpy = jasmine.createSpyObj(
        'InvestorTestService',
        {
          getQuestionKeyByNumber: 'Pregunta2',
          getQuestionByKey: testQuestions.Pregunta2,
        },
        {
          questions: testQuestions,
          totalNumberOfQuestions: Object.keys(testQuestions).length,
          hasLoadedQuestions: true,
        }
      );

      TestBed.configureTestingModule({
        declarations: [InvestorTestQuestionPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: InvestorTestService, useValue: investorTestServiceSpy },
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
    spyOnProperty(component, 'totalNumberOfQuestions').and.returnValue(4);
    expect(component.progress).toEqual('50%');
  });

  it('should return 100% when user is on question 4 out of 4 on progress getter', () => {
    component.currentQuestionNumber = 4;
    spyOnProperty(component, 'totalNumberOfQuestions').and.returnValue(4);
    expect(component.progress).toEqual('100%');
  });

  it('should return empty string when user is on question 5 out of 4 on progress getter', () => {
    component.currentQuestionNumber = 5;
    spyOnProperty(component, 'totalNumberOfQuestions').and.returnValue(4);
    expect(component.progress).toEqual('');
  });

  it('should return empty string when user is on question 0 out of 4 on progress getter', () => {
    component.currentQuestionNumber = 0;
    spyOnProperty(component, 'totalNumberOfQuestions').and.returnValue(4);
    expect(component.progress).toEqual('');
  });

  it('should return true when user is on question 4 out of 4 on isLastQuestion getter', () => {
    component.currentQuestionNumber = 4;
    spyOnProperty(component, 'totalNumberOfQuestions').and.returnValue(4);
    expect(component.isLastQuestion).toBeTrue();
  });

  it('should return false when user is on question 1 out of 4 on isLastQuestion getter', () => {
    component.currentQuestionNumber = 1;
    spyOnProperty(component, 'totalNumberOfQuestions').and.returnValue(4);
    expect(component.isLastQuestion).toBeFalse();
  });

  it('should return false when user is on question 5 out of 4 on isLastQuestion getter', () => {
    component.currentQuestionNumber = 5;
    spyOnProperty(component, 'totalNumberOfQuestions').and.returnValue(4);
    expect(component.isLastQuestion).toBeFalse();
  });

  it('should return false when user is on question 0 out of 4 on isLastQuestion getter', () => {
    component.currentQuestionNumber = 0;
    spyOnProperty(component, 'totalNumberOfQuestions').and.returnValue(4);
    expect(component.isLastQuestion).toBeFalse();
  });

  it('should get question number and key and show question with answers on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const question = fixture.debugElement.query(By.css('ion-text[name="Question"]')).nativeElement.innerHTML;
    const numberOfAnswers = fixture.debugElement.queryAll(By.css('ion-text[name="Option"]')).length;
    expect(component.currentQuestionNumber).toEqual(1);
    expect(component.currentQuestionKey).toEqual('Pregunta2');
    expect(component.question).toEqual(testQuestions.Pregunta2);
    expect(question).toEqual(testQuestions.Pregunta2.text);
    expect(numberOfAnswers).toEqual(Object.keys(testQuestions.Pregunta2.options).length);
  });

  it('should redirect to first question if question is invalid on ionViewWillEnter', () => {
    activatedRouteMock.snapshot.paramMap.get = (question) => 'test';
    component.ionViewWillEnter();
    expect(component.currentQuestionNumber).toEqual(NaN);
    expect(component.currentQuestionKey).toEqual(undefined);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/wealth-management/investor-test/1']);
  });

  it('should redirect to first question if question is undefined on ionViewWillEnter', () => {
    activatedRouteMock.snapshot.paramMap.get = (question) => undefined;
    component.ionViewWillEnter();
    expect(component.currentQuestionNumber).toEqual(NaN);
    expect(component.currentQuestionKey).toEqual(undefined);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/wealth-management/investor-test/1']);
  });

  it('should show next button text when is not last question', () => {
    activatedRouteMock.snapshot.paramMap.get = (question) => '2';
    component.ionViewWillEnter();
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('ion-button[name="Submit"]')).nativeElement.innerHTML;
    expect(text).toEqual('wealth_management.investor_test.next_button');
  });

  it('should show submit button text when is not last question', () => {
    activatedRouteMock.snapshot.paramMap.get = (question) => Object.keys(testQuestions).length.toString();
    component.ionViewWillEnter();
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('ion-button[name="Submit"]')).nativeElement.innerHTML;
    expect(text).toEqual('wealth_management.investor_test.submit_button');
  });

  it('should load answer if question has already been answered');

  it('should redirect to next question when Submit Button clicked');

  it('should send user score on last question and navigate to Success Page when Submit Button clicked');
});
