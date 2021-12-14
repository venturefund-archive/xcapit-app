import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
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

describe('InvestorTestQuestionPage', () => {
  let component: InvestorTestQuestionPage;
  let fixture: ComponentFixture<InvestorTestQuestionPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let activatedRouteMock: any;
  let investorTestServiceSpy: jasmine.SpyObj<InvestorTestService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InvestorTestQuestionPage>;

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
          getQuestionKeyByNumber: 'Pregunta1',
          getQuestionByKey: testQuestions.Pregunta1,
          getAnswerKeyByQuestionKey: 'opcion2',
          setAnswer: undefined,
          loadQuestions: undefined,
          hasAnsweredQuestion: false,
          cancel: undefined,
          saveAnswers: of({}),
        },
        {
          questions: testQuestions,
          totalNumberOfQuestions: Object.keys(testQuestions).length,
          hasLoadedQuestions: true,
        }
      );

      TestBed.configureTestingModule({
        declarations: [InvestorTestQuestionPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
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
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
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
    expect(component.currentQuestionNumber).toEqual(1);
    expect(component.currentQuestionKey).toEqual('Pregunta1');
    expect(component.question).toEqual(testQuestions.Pregunta1);
    expect(question).toEqual(testQuestions.Pregunta1.text);
    expect(Object.keys(component.answers).length).toEqual(Object.keys(testQuestions.Pregunta1.options).length);
    expect(component.answersKeys).toEqual(Object.keys(testQuestions.Pregunta1.options));
  });

  it('should get question number and key and show question with answers when previous question has been answered on ionViewWillEnter', () => {
    investorTestServiceSpy.hasAnsweredQuestion.and.returnValue(true);
    investorTestServiceSpy.getQuestionKeyByNumber.and.returnValue('Pregunta2');
    investorTestServiceSpy.getQuestionByKey.and.returnValue(testQuestions.Pregunta2);
    activatedRouteMock.snapshot.paramMap.get = (question) => '2';
    component.ionViewWillEnter();
    fixture.detectChanges();
    const question = fixture.debugElement.query(By.css('ion-text[name="Question"]')).nativeElement.innerHTML;
    expect(component.currentQuestionNumber).toEqual(2);
    expect(component.currentQuestionKey).toEqual('Pregunta2');
    expect(component.question).toEqual(testQuestions.Pregunta2);
    expect(question).toEqual(testQuestions.Pregunta2.text);
    expect(Object.keys(component.answers).length).toEqual(Object.keys(testQuestions.Pregunta2.options).length);
    expect(component.answersKeys).toEqual(Object.keys(testQuestions.Pregunta2.options));
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

  it('should redirect to first question if question is greater than total questions on ionViewWillEnter', () => {
    activatedRouteMock.snapshot.paramMap.get = (question) => 6;
    component.ionViewWillEnter();
    expect(component.currentQuestionNumber).toEqual(6);
    expect(component.currentQuestionKey).toEqual(undefined);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/wealth-management/investor-test/1']);
  });

  it('should redirect to first question if question is less than total questions on ionViewWillEnter', () => {
    activatedRouteMock.snapshot.paramMap.get = (question) => '0';
    component.ionViewWillEnter();
    expect(component.currentQuestionNumber).toEqual(0);
    expect(component.currentQuestionKey).toEqual(undefined);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/wealth-management/investor-test/1']);
  });

  it('should redirect to first question if user is trying to skip questions on ionViewWillEnter', () => {
    activatedRouteMock.snapshot.paramMap.get = (question) => '2';
    component.ionViewWillEnter();
    expect(component.currentQuestionNumber).toEqual(2);
    expect(component.currentQuestionKey).toEqual(undefined);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/wealth-management/investor-test/1']);
  });

  it('should show next button text when is not last question', () => {
    activatedRouteMock.snapshot.paramMap.get = (question) => '2';
    investorTestServiceSpy.hasAnsweredQuestion.and.returnValue(true);
    component.ionViewWillEnter();
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('ion-button[name="Submit"]')).nativeElement.innerHTML;
    expect(text).toEqual('wealth_managements.investor_test.next_button');
  });

  it('should show submit button text when is not last question', () => {
    activatedRouteMock.snapshot.paramMap.get = (question) => Object.keys(testQuestions).length.toString();
    investorTestServiceSpy.hasAnsweredQuestion.and.returnValue(true);
    component.ionViewWillEnter();
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('ion-button[name="Submit"]')).nativeElement.innerHTML;
    expect(text).toEqual('wealth_managements.investor_test.submit_button');
  });

  it('should cancel test when user leaves', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-back-button')).nativeElement.click();
    expect(investorTestServiceSpy.cancel).toHaveBeenCalledTimes(1);
  });

  it('should load answer if question has already been answered', () => {
    investorTestServiceSpy.hasAnsweredQuestion.and.returnValue(true);
    activatedRouteMock.snapshot.paramMap.get = (question) => '1';
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.form.value).toEqual({ answer: 'opcion2' });
  });

  it('should not load answer if question has not already been answered', () => {
    investorTestServiceSpy.hasAnsweredQuestion.and.returnValue(false);
    activatedRouteMock.snapshot.paramMap.get = (question) => '1';
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.form.value).toEqual({ answer: '' });
  });

  it('should redirect to next question when Submit Button clicked', () => {
    component.ionViewWillEnter();
    component.form.patchValue({ answer: 'opcion1' });
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Submit Button clicked', () => {
    component.ionViewWillEnter();
    component.form.patchValue({ answer: 'opcion1' });
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Submit');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should disable button if no answer was selected', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('ion-button[name="Submit"]')).nativeElement;
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(button.attributes['ng-reflect-disabled']).toBeTruthy();
  });

  it('should send user score on last question and navigate to Success Page when Submit Button clicked', () => {
    investorTestServiceSpy.hasAnsweredQuestion.and.returnValue(true);
    investorTestServiceSpy.getQuestionKeyByNumber.and.returnValue('Pregunta5');
    investorTestServiceSpy.getQuestionByKey.and.returnValue(testQuestions.Pregunta5);
    activatedRouteMock.snapshot.paramMap.get = (question) => '5';
    component.ionViewWillEnter();
    component.form.patchValue({ answer: 'opcion1' });
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(investorTestServiceSpy.saveAnswers).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wealth-management/success-investor-test']);
  });
});
