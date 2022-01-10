import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiProfilesService } from 'src/app/modules/profiles/shared-profiles/services/api-profiles/api-profiles.service';
import {
  Answer,
  ApiWealthManagementsService,
  Question,
} from '../api-wealth-managements/api-wealth-managements.service';

@Injectable({
  providedIn: 'root',
})
export class InvestorTestService {
  answers: Map<Question, Answer>;
  questions: Question[];

  get hasLoadedQuestions(): boolean {
    return !!this.questions && this.questions.length !== 0;
  }

  get hasAnsweredAtLeastOneQuestion(): boolean {
    return !!this.answers && this.answers.size !== 0;
  }

  get hasAnsweredAllQuestions(): boolean {
    return this.hasLoadedQuestions && !!this.answers && this.answers.size === this.questions.length;
  }

  get numberOfQuestionsAnswered(): number {
    if (!this.answers) {
      return 0;
    }

    return this.answers.size;
  }

  get totalScore(): number {
    let partialScore = 0;

    if (this.hasAnsweredAtLeastOneQuestion) {
      this.answers.forEach((answer, question) => {
        partialScore += answer.points;
      });
    }

    return partialScore;
  }

  get totalNumberOfQuestions(): number {
    return this.questions.length;
  }

  constructor(
    private apiWealthManagementsService: ApiWealthManagementsService,
    private apiProfilesService: ApiProfilesService
  ) {}

  getQuestionByNumber(n: number): Question {
    if (n > this.questions.length) {
      return;
    }

    return this.questions.sort((a, b) => a.order - b.order)[n - 1];
  }

  getAnswerByQuestion(question: Question): Answer {
    if (!this.hasLoadedQuestions || !this.hasAnsweredAtLeastOneQuestion) {
      return;
    }

    return this.answers.get(question);
  }

  async loadQuestions() {
    return Promise.resolve().then(() => {
      if (!this.hasLoadedQuestions) {
        return this.apiWealthManagementsService
          .getInvestorTestQuestions()
          .toPromise()
          .then((questions) => {
            this.questions = questions;
            return Promise.resolve();
          });
      } else return Promise.resolve();
    });
  }

  setAnswer(question: Question, answer: Answer) {
    if (!this.hasAnsweredAtLeastOneQuestion) {
      this.answers = new Map<Question, Answer>();
    }

    this.answers.set(question, answer);
  }

  hasAnsweredQuestion(questionNumber: number): boolean {
    return !!this.answers && !!this.answers.get(this.getQuestionByNumber(questionNumber));
  }

  saveAnswers(): Observable<any> {
    if (this.hasAnsweredAllQuestions) {
      return this.apiProfilesService.crud.patch({ investor_score: this.totalScore });
    }
  }

  cancel() {
    this.answers = new Map();
  }
}
