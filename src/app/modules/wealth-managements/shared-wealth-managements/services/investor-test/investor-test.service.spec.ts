import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiWealthManagementsService } from '../api-wealth-managements/api-wealth-managements.service';

import { InvestorTestService } from './investor-test.service';

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

  it('should return false when questions is empty object on hasLoadedQuestions getter', () => {
    service.questions = {};
    expect(service.hasLoadedQuestions).toBeFalse();
  });

  it('should return true when questions has one question on hasLoadedQuestions getter', () => {
    service.questions = {
      Pregunta1: testQuestions.Pregunta1,
    };
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
    service.answers = new Map<string, string>();
    expect(service.hasAnsweredAtLeastOneQuestion).toBeFalse();
  });

  it('should return true when answers has one answers on hasAnsweredQuestion getter', () => {
    service.answers = new Map<string, string>();
    service.answers.set('Pregunta2', 'opcion1');
    expect(service.hasAnsweredAtLeastOneQuestion).toBeTrue();
  });

  it('should return Pregunta4 when asking for 4th question on getQuestionByNumber', () => {
    service.loadQuestions();
    const question = service.getQuestionKeyByNumber(4);
    expect(question).toEqual('Pregunta4');
  });

  it('should return Pregunta1 when asking for 1st question on getQuestionByNumber', () => {
    service.loadQuestions();
    const question = service.getQuestionKeyByNumber(1);
    expect(question).toEqual('Pregunta1');
  });

  it('should return undefined when question does not exist on getQuestionByNumber', () => {
    service.loadQuestions();
    const question = service.getQuestionKeyByNumber(10);
    expect(question).toBeUndefined();
  });

  it('should return undefined when questions have not been loaded on getAnswerKeyByQuestionKey', () => {
    service.answers = undefined;
    service.questions = undefined;
    const answerKey = service.getAnswerKeyByQuestionKey('Pregunta1');
    expect(answerKey).toBeUndefined();
  });

  it('should return undefined when answers have not been defined on getAnswerKeyByQuestionKey', () => {
    service.answers = undefined;
    const answerKey = service.getAnswerKeyByQuestionKey('Pregunta1');
    expect(answerKey).toBeUndefined();
  });

  it('should return opcion1 when answers contains one answer on getAnswerKeyByQuestionKey', () => {
    service.answers = new Map();
    service.answers.set('Pregunta1', 'opcion1');
    const answerKey = service.getAnswerKeyByQuestionKey('Pregunta1');
    expect(answerKey).toEqual('opcion1');
  });

  it('should return undefined when user has not answered that question on getAnswerKeyByQuestionKey', () => {
    service.answers = new Map();
    service.answers.set('Pregunta1', 'opcion1');
    const answerKey = service.getAnswerKeyByQuestionKey('Pregunta2');
    expect(answerKey).toBeUndefined();
  });

  it('should add element to map on setAnswer', () => {
    service.answers = new Map();
    service.answers.set('Pregunta1', 'opcion1');
    service.setAnswer('Pregunta2', 'opcion2');
    expect(service.answers.size).toEqual(2);
  });

  it('should add element to map if map empty on setAnswer', () => {
    service.answers = new Map();
    service.setAnswer('Pregunta1', 'opcion2');
    expect(service.answers.size).toEqual(1);
  });

  it('should create map and add element if answers is undefined on setAnswer', () => {
    service.setAnswer('Pregunta1', 'opcion1');
    expect(service.answers.size).toEqual(1);
  });

  it('should change answer if same answer is set on setAnswer', () => {
    service.answers = new Map();
    service.answers.set('Pregunta1', 'opcion1');
    service.setAnswer('Pregunta1', 'opcion2');
    expect(service.answers.size).toEqual(1);
    expect(service.answers.get('Pregunta1')).toEqual('opcion2');
  });

  it('should return true if user has answered all questions on get hasAnsweredAllQuestions', () => {
    service.questions = { Pregunta1: testQuestions.Pregunta1 };
    service.answers = new Map();
    service.answers.set('Pregunta1', 'opcion1');
    expect(service.hasAnsweredAllQuestions).toBeTrue();
  });

  it('should return false if user has answered one question on get hasAnsweredAllQuestions', () => {
    service.answers = new Map();
    service.answers.set('Pregunta1', 'opcion1');
    expect(service.hasAnsweredAllQuestions).toBeFalse();
  });

  it('should return false if questions are not loaded on get hasAnsweredAllQuestions', () => {
    service.questions = undefined;
    service.answers = new Map();
    service.answers.set('Pregunta1', 'opcion1');
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
    service.answers.set('Pregunta1', 'opcion3');
    service.answers.set('Pregunta2', 'opcion1');
    expect(service.totalScore).toEqual(4);
  });

  it('should return the number of questions on get totalNumberOfQuestions', () => {
    expect(service.totalNumberOfQuestions).toEqual(Object.keys(testQuestions).length);
  });

  it('should return true if there is an answer for question on hasAnsweredQuestion', () => {
    service.answers = new Map();
    service.answers.set('Pregunta1', 'opcion3');
    expect(service.hasAnsweredQuestion(1)).toBeTrue();
  });

  it('should return false if there is no answer for question on hasAnsweredQuestion', () => {
    service.answers = new Map();
    service.answers.set('Pregunta1', 'opcion3');
    expect(service.hasAnsweredQuestion(2)).toBeFalse();
  });

  it('should return 2 if 2 questions answered on get numberOfQuestionsAnswered', () => {
    service.answers = new Map();
    service.answers.set('Pregunta1', 'opcion3');
    service.answers.set('Pregunta2', 'opcion2');
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
