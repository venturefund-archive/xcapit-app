import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  Answer,
  ApiWealthManagementsService,
  Question,
} from '../api-wealth-managements/api-wealth-managements.service';
import { InvestorTestService } from './investor-test.service';

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
];

const testQuestionsUnsorted: Question[] = [
  {
    text: 'blablabla',
    order: 3,
    options: [
      { text: 'blablabla', points: 1 },
      { text: 'blablabla', points: 2 },
    ],
  },
  {
    text: 'Que tan arriesgado sos?',
    order: 1,
    options: [
      { text: 'Me asustan las cachorros', points: 1 },
      { text: 'Mas o menos', points: 2 },
      { text: 'Me tiro a la pileta sin agua', points: 3 },
    ],
  },
  {
    text: 'blablabla',
    order: 0,
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
    order: 4,
    options: [
      { text: 'blablabla', points: 1 },
      { text: 'blablabla', points: 2 },
      { text: 'blablabla', points: 3 },
    ],
  },
];

describe('InvestorTestService', () => {
  let service: InvestorTestService;
  let apiWealthManagementsServiceSpy: jasmine.SpyObj<ApiWealthManagementsService>;

  beforeEach(() => {
    apiWealthManagementsServiceSpy = jasmine.createSpyObj('ApiWealthManagementsService', {
      getInvestorTestQuestions: of(testQuestions),
      saveInvestorTestScore: of(),
    });
    TestBed.configureTestingModule({
      providers: [{ provide: ApiWealthManagementsService, useValue: apiWealthManagementsServiceSpy }],
    });
    service = TestBed.inject(InvestorTestService);

    service.questions = testQuestions;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when questions is null on hasLoadedQuestions getter', () => {
    service.questions = null;
    expect(service.hasLoadedQuestions).toBeFalse();
  });

  it('should return false when questions is undefined on hasLoadedQuestions getter', () => {
    service.questions = undefined;
    expect(service.hasLoadedQuestions).toBeFalse();
  });

  it('should return true when questions has one question on hasLoadedQuestions getter', () => {
    service.questions = [testQuestions[0]];
    expect(service.hasLoadedQuestions).toBeTrue();
  });

  it('should return true when questions has two questions on hasLoadedQuestions getter', () => {
    expect(service.hasLoadedQuestions).toBeTrue();
  });

  it('should return false when answers is null on hasAnsweredQuestion getter', () => {
    service.answers = null;
    expect(service.hasAnsweredAtLeastOneQuestion).toBeFalse();
  });

  it('should return false when answers is undefined on hasAnsweredQuestion getter', () => {
    service.answers = undefined;
    expect(service.hasAnsweredAtLeastOneQuestion).toBeFalse();
  });

  it('should return false when answers is empty Map on hasAnsweredQuestion getter', () => {
    service.answers = new Map<Question, Answer>();
    expect(service.hasAnsweredAtLeastOneQuestion).toBeFalse();
  });

  it('should return true when answers has one answers on hasAnsweredQuestion getter', () => {
    service.answers = new Map<Question, Answer>();
    service.answers.set(testQuestions[0], testQuestions[0].options[0]);
    expect(service.hasAnsweredAtLeastOneQuestion).toBeTrue();
  });

  it('should return 4th question when asking for 4th question on getQuestionByNumber', () => {
    service.questions = Object.assign([], testQuestionsUnsorted);
    const question = service.getQuestionByNumber(4);
    expect(question.order).toEqual(3);
  });

  it('should return first question when asking for 1st question on getQuestionByNumber', () => {
    service.loadQuestions();
    const question = service.getQuestionByNumber(1);
    expect(question.order).toEqual(0);
  });

  it('should return undefined when question does not exist on getQuestionByNumber', () => {
    service.loadQuestions();
    const question = service.getQuestionByNumber(10);
    expect(question).toBeUndefined();
  });

  it('should return undefined when questions have not been loaded on getAnswerByQuestion', () => {
    service.answers = undefined;
    service.questions = undefined;
    const answer = service.getAnswerByQuestion(testQuestions[0]);
    expect(answer).toBeUndefined();
  });

  it('should sort array on getQuestionByNumber', () => {
    service.questions = Object.assign([], testQuestionsUnsorted);
    service.getQuestionByNumber(1);
    const order = service.questions.map((q) => q.order);
    expect(order).toEqual([0, 1, 2, 3, 4]);
  });

  it('should return undefined when answers have not been defined on getAnswerByQuestion', () => {
    service.answers = undefined;
    const answer = service.getAnswerByQuestion(testQuestions[0]);
    expect(answer).toBeUndefined();
  });

  it('should return opcion1 when answers contains one answer on getAnswerByQuestion', () => {
    service.answers = new Map();
    service.answers.set(testQuestions[0], testQuestions[0].options[0]);
    const answer = service.getAnswerByQuestion(testQuestions[0]);
    expect(answer).toEqual(testQuestions[0].options[0]);
  });

  it('should return undefined when user has not answered that question on getAnswerByQuestion', () => {
    service.answers = new Map();
    service.answers.set(testQuestions[0], testQuestions[0].options[0]);
    const answer = service.getAnswerByQuestion(testQuestions[1]);
    expect(answer).toBeUndefined();
  });

  it('should add element to map on setAnswer', () => {
    service.answers = new Map();
    service.answers.set(testQuestions[0], testQuestions[0].options[0]);
    service.setAnswer(testQuestions[1], testQuestions[1].options[1]);
    expect(service.answers.size).toEqual(2);
  });

  it('should add element to map if map empty on setAnswer', () => {
    service.answers = new Map();
    service.setAnswer(testQuestions[0], testQuestions[0].options[1]);
    expect(service.answers.size).toEqual(1);
  });

  it('should create map and add element if answers is undefined on setAnswer', () => {
    service.setAnswer(testQuestions[0], testQuestions[0].options[1]);
    expect(service.answers.size).toEqual(1);
  });

  it('should change answer if same answer is set on setAnswer', () => {
    service.answers = new Map();
    service.answers.set(testQuestions[0], testQuestions[0].options[0]);
    service.setAnswer(testQuestions[0], testQuestions[0].options[1]);
    expect(service.answers.size).toEqual(1);
    expect(service.answers.get(testQuestions[0])).toEqual(testQuestions[0].options[1]);
  });

  it('should return true if user has answered all questions on get hasAnsweredAllQuestions', () => {
    service.questions = [testQuestions[0]];
    service.answers = new Map();
    service.answers.set(testQuestions[0], testQuestions[0].options[0]);
    expect(service.hasAnsweredAllQuestions).toBeTrue();
  });

  it('should return false if user has answered one question on get hasAnsweredAllQuestions', () => {
    service.answers = new Map();
    service.answers.set(testQuestions[0], testQuestions[0].options[0]);
    expect(service.hasAnsweredAllQuestions).toBeFalse();
  });

  it('should return false if questions are not loaded on get hasAnsweredAllQuestions', () => {
    service.questions = undefined;
    service.answers = new Map();
    service.answers.set(testQuestions[0], testQuestions[0].options[0]);
    expect(service.hasAnsweredAllQuestions).toBeFalse();
  });

  it('should return false if answers is undefined on get hasAnsweredAllQuestions', () => {
    service.answers = undefined;
    expect(service.hasAnsweredAllQuestions).toBeFalse();
  });

  it('should not call saveInvestorTestScore if hasAnsweredAllQuestions is false on saveAnswers', () => {
    spyOnProperty(service, 'hasAnsweredAllQuestions').and.returnValue(false);
    service.saveAnswers();
    expect(apiWealthManagementsServiceSpy.saveInvestorTestScore).not.toHaveBeenCalled();
  });

  it('should call saveInvestorTestScore if hasAnsweredAllQuestions is true on saveAnswers', () => {
    spyOnProperty(service, 'hasAnsweredAllQuestions').and.returnValue(true);
    service.saveAnswers();
    expect(apiWealthManagementsServiceSpy.saveInvestorTestScore).toHaveBeenCalledTimes(1);
  });

  it('should return 0 if has not answered any question on get totalScore', () => {
    spyOnProperty(service, 'hasAnsweredAtLeastOneQuestion').and.returnValue(false);
    expect(service.totalScore).toEqual(0);
  });

  it('should return total score if has answered 2 questions on get totalScore', () => {
    service.answers = new Map();
    service.answers.set(testQuestions[0], testQuestions[0].options[0]);
    service.answers.set(testQuestions[1], testQuestions[1].options[2]);
    expect(service.totalScore).toEqual(4);
  });

  it('should return true if there is an answer for question on hasAnsweredQuestion', () => {
    service.answers = new Map();
    service.answers.set(testQuestions[0], testQuestions[0].options[2]);
    expect(service.hasAnsweredQuestion(1)).toBeTrue();
  });

  it('should return false if there is no answer for question on hasAnsweredQuestion', () => {
    service.answers = new Map();
    service.answers.set(testQuestions[0], testQuestions[0].options[2]);
    expect(service.hasAnsweredQuestion(2)).toBeFalse();
  });

  it('should return 2 if 2 questions answered on get numberOfQuestionsAnswered', () => {
    service.answers = new Map();
    service.answers.set(testQuestions[0], testQuestions[0].options[1]);
    service.answers.set(testQuestions[1], testQuestions[1].options[2]);
    expect(service.numberOfQuestionsAnswered).toEqual(2);
  });

  it('should return 0 if 0 questions answered on get numberOfQuestionsAnswered', () => {
    service.answers = new Map();
    expect(service.numberOfQuestionsAnswered).toEqual(0);
  });

  it('should return 0 if answers is undefined numberOfQuestionsAnswered', () => {
    expect(service.numberOfQuestionsAnswered).toEqual(0);
  });
});
