import { Injectable } from '@angular/core';
import { timingSafeEqual } from 'crypto';
import { Observable } from 'rxjs';
import { ApiWealthManagementsService } from '../api-wealth-managements/api-wealth-managements.service';

@Injectable({
  providedIn: 'root',
})
export class InvestorTestService {
  answers: Map<string, string>;
  questions: any;

  get hasLoadedQuestions(): boolean {
    return !!this.questions && Object.keys(this.questions).length !== 0;
  }

  get hasAnsweredAtLeastOneQuestion(): boolean {
    return !!this.answers && this.answers.size !== 0;
  }

  get hasAnsweredAllQuestions(): boolean {
    return this.hasLoadedQuestions && !!this.answers && this.answers.size === Object.keys(this.questions).length;
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
        partialScore += this.questions[question].options[answer].points;
      });
    }

    return partialScore;
  }

  get totalNumberOfQuestions(): number {
    return Object.keys(this.questions).length;
  }

  constructor(private apiWealthManagementsService: ApiWealthManagementsService) {}

  getQuestionByKey(key: string): any {
    return this.questions[key];
  }

  getQuestionKeyByNumber(n: number): any {
    if (n > Object.keys(this.questions).length) {
      return;
    }

    return Object.keys(this.questions)[n - 1];
  }

  getAnswerKeyByQuestionKey(questionKey: string): string {
    if (!this.hasLoadedQuestions || !this.hasAnsweredAtLeastOneQuestion) {
      return;
    }

    return this.answers.get(questionKey);
  }

  loadQuestions() {
    if (!this.hasLoadedQuestions) {
      this.apiWealthManagementsService.getInvestorTestQuestions().subscribe((questions) => {
        this.questions = questions;
      });
    }
  }

  setAnswer(questionKey: string, answerKey: string) {
    if (!this.hasAnsweredAtLeastOneQuestion) {
      this.answers = new Map<string, string>();
    }

    this.answers.set(questionKey, answerKey);
  }

  hasAnsweredQuestion(questionNumber: number): boolean {
    return !!this.answers && !!this.answers.get(this.getQuestionKeyByNumber(questionNumber));
  }

  saveAnswers(): Observable<any> {
    if (this.hasAnsweredAllQuestions) {
      return this.apiWealthManagementsService.saveInvestorTestScore(null, this.totalScore);
    }
  }

  cancel() {
    this.answers = new Map();
  }
}
