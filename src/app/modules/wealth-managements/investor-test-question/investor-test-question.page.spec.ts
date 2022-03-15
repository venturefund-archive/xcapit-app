import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { Question } from '../shared-wealth-managements/services/api-wealth-managements/api-wealth-managements.service';
import { InvestorTestService } from '../shared-wealth-managements/services/investor-test/investor-test.service';

import { InvestorTestQuestionPage } from './investor-test-question.page';

const testQuestions: Question[] = [
  {
    text: 'Que tan arriesgado sos?',
    order: 0,
    options: [
      { text: 'Me asustan las cachorros', points: 1 },
      { text: 'Mas o menos', points: 2 },
      { text: 'Me tiro a la pileta sin agua', points: 3 },
    ],
  },
  {
    text: 'blablabla',
    order: 1,
    options: [
      { text: 'blablabla', points: 1 },
      { text: 'blablabla', points: 2 },
      { text: 'blablabla', points: 3 },
    ],
  },
  {
    text: 'blablabla',
    order: 2,
    options: [
      { text: 'blablabla', points: 1 },
      { text: 'blablabla', points: 2 },
      { text: 'blablabla', points: 3 },
    ],
  },
  {
    text: 'blablabla',
    order: 3,
    options: [
      { text: 'blablabla', points: 1 },
      { text: 'blablabla', points: 2 },
    ],
  },
  {
    text: 'blablabla',
    order: 4,
    options: [
      { text: 'blablabla', points: 1 },
      { text: 'blablabla', points: 2 },
      { text: 'blablabla', points: 3 },
    ],
  },
];

describe('InvestorTestQuestionPage', () => {
  let component: InvestorTestQuestionPage;
  let fixture: ComponentFixture<InvestorTestQuestionPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let investorTestServiceSpy: jasmine.SpyObj<InvestorTestService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InvestorTestQuestionPage>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      fakeActivatedRoute = new FakeActivatedRoute({ question: '1', mode: 'defi' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();

      investorTestServiceSpy = jasmine.createSpyObj(
        'InvestorTestService',
        {
          getQuestionByNumber: testQuestions[0],
          getAnswerByQuestion: testQuestions[0].options[0],
          setAnswer: undefined,
          loadQuestions: Promise.resolve(),
          hasAnsweredQuestion: false,
          clearAnswers: undefined,
          saveAnswers: of({}),
        },
        {
          questions: testQuestions,
          totalNumberOfQuestions: testQuestions.length,
          hasLoadedQuestions: true,
        }
      );

      TestBed.configureTestingModule({
        declarations: [InvestorTestQuestionPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
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

  it('should get question number and show question with answers on ionViewWillEnter', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const question = fixture.debugElement.query(By.css('ion-text[name="Question"]')).nativeElement.innerHTML;
    expect(component.currentQuestionNumber).toEqual(1);
    expect(component.question).toEqual(testQuestions[0]);
    expect(question).toEqual(testQuestions[0].text);
    expect(component.answers.length).toEqual(testQuestions[0].options.length);
  });

  it('should get question number and show question with answers when previous question has been answered on ionViewWillEnter', async () => {
    investorTestServiceSpy.hasAnsweredQuestion.and.returnValue(true);
    investorTestServiceSpy.getQuestionByNumber.and.returnValue(testQuestions[1]);
    fakeActivatedRoute.modifySnapshotParams({ question: '2' });
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const question = fixture.debugElement.query(By.css('ion-text[name="Question"]')).nativeElement.innerHTML;
    expect(component.currentQuestionNumber).toEqual(2);
    expect(component.question).toEqual(testQuestions[1]);
    expect(question).toEqual(testQuestions[1].text);
    expect(component.answers.length).toEqual(testQuestions[1].options.length);
  });

  it('should redirect to first question if question is invalid on ionViewWillEnter', async () => {
    fakeActivatedRoute.modifySnapshotParams({ question: 'test', mode: 'defi' });
    component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.currentQuestionNumber).toEqual(NaN);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/wealth-management/investor-test/defi/1']);
  });

  it('should redirect to first question if question is undefined on ionViewWillEnter', async () => {
    fakeActivatedRoute.modifySnapshotParams({ question: undefined, mode: 'defi' });
    component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.currentQuestionNumber).toEqual(NaN);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/wealth-management/investor-test/defi/1']);
  });

  it('should redirect to first question if question is greater than total questions on ionViewWillEnter', async () => {
    fakeActivatedRoute.modifySnapshotParams({ question: 6, mode: 'defi' });
    component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.currentQuestionNumber).toEqual(6);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/wealth-management/investor-test/defi/1']);
  });

  it('should redirect to first question if question is less than total questions on ionViewWillEnter', async () => {
    fakeActivatedRoute.modifySnapshotParams({ question: 0, mode: 'defi' });
    component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.currentQuestionNumber).toEqual(0);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/wealth-management/investor-test/defi/1']);
  });

  it('should redirect to first question if user is trying to skip questions on ionViewWillEnter', async () => {
    fakeActivatedRoute.modifySnapshotParams({ question: 2, mode: 'defi' });
    component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.currentQuestionNumber).toEqual(2);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/wealth-management/investor-test/defi/1']);
  });

  it('should show next button text when is not last question', async () => {
    fakeActivatedRoute.modifySnapshotParams({ question: '2' });
    investorTestServiceSpy.hasAnsweredQuestion.and.returnValue(true);
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('ion-button[name="Submit"]')).nativeElement.innerHTML;
    expect(text).toEqual('wealth_managements.investor_test.next_button');
  });

  it('should show submit button text when is not last question', async () => {
    fakeActivatedRoute.modifySnapshotParams({ question: testQuestions.length.toString() });
    investorTestServiceSpy.hasAnsweredQuestion.and.returnValue(true);
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('ion-button[name="Submit"]')).nativeElement.innerHTML;
    expect(text).toEqual('wealth_managements.investor_test.submit_button');
  });

  it('should clear test answers when user leaves', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-back-button')).nativeElement.click();
    expect(investorTestServiceSpy.clearAnswers).toHaveBeenCalledTimes(1);
  });

  it('should load answer if question has already been answered', async () => {
    investorTestServiceSpy.hasAnsweredQuestion.and.returnValue(true);
    fakeActivatedRoute.modifySnapshotParams({ question: '1' });
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value).toEqual({ answer: testQuestions[0].options[0] });
  });

  it('should not load answer if question has not already been answered', async () => {
    investorTestServiceSpy.hasAnsweredQuestion.and.returnValue(false);
    fakeActivatedRoute.modifySnapshotParams({ question: '1' });
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.detectChanges();
    expect(component.form.value).toEqual({ answer: '' });
  });

  it('should redirect to next question when Submit Button clicked', async () => {
    component.ionViewWillEnter();
    component.form.patchValue({ answer: 'opcion1' });
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Submit Button clicked', async () => {
    component.ionViewWillEnter();
    component.form.patchValue({ answer: 'opcion1' });
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Submit');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should disable button if no answer was selected', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('ion-button[name="Submit"]')).nativeElement;
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(button.attributes['ng-reflect-disabled']).toBeTruthy();
  });

  it('should send user score and clear answers on last question and navigate to Success Page when Submit Button clicked', async () => {
    investorTestServiceSpy.hasAnsweredQuestion.and.returnValue(true);
    investorTestServiceSpy.getQuestionByNumber.and.returnValue(testQuestions[4]);
    fakeActivatedRoute.modifySnapshotParams({ question: '5' });
    component.ionViewWillEnter();
    component.form.patchValue({ answer: 'opcion1' });
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(investorTestServiceSpy.clearAnswers).toHaveBeenCalledTimes(1);
    expect(investorTestServiceSpy.saveAnswers).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wealth-management/success-investor-test']);
  });

  it('should redirect to defi products page if the mode is equal to defi and the back button is clicked', async () => {
    fakeActivatedRoute.modifySnapshotParams({ question: 1, mode: 'defi' });
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.debugElement.query(By.css("ion-back-button[name='back']")).nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['tabs/investments/defi']);
  });

  it('should redirect to option to select page if the mode is equal to options and the back button is clicked', async () => {
    fakeActivatedRoute.modifySnapshotParams({ question: 1, mode: 'options' });
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.debugElement.query(By.css("ion-back-button[name='back']")).nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['wealth-management/investor-test-options']);
  });
});
