import { Injectable } from '@angular/core';
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

  get totalScore(): number {
    let partialScore = 0;

    if (this.hasAnsweredAtLeastOneQuestion) {
      this.answers.forEach((answer, question) => {
        partialScore += this.questions[question].options[answer].points;
      });
    }

    return partialScore;
  }

  constructor(private apiWealthManagementsService: ApiWealthManagementsService) {}

  getQuestionByKey(key: string): any {
    this.loadQuestions();

    return this.questions[key];
  }

  getQuestionByNumber(n: number): any {
    this.loadQuestions();

    if (n > Object.keys(this.questions).length) {
      return;
    }

    const questionKey = Object.keys(this.questions)[n - 1];

    return this.questions[questionKey];
  }

  getAnswerKeyByQuestionKey(questionKey: string): string {
    if (!this.hasLoadedQuestions || !this.hasAnsweredAtLeastOneQuestion) {
      return;
    }

    return this.answers.get(questionKey);
  }

  private loadQuestions() {
    if (!this.hasLoadedQuestions) {
      this.apiWealthManagementsService.getInvestorTestQuestions().subscribe((questions) => {
        this.questions = questions;
      });
    }
  }

  setAnswer(questionKey: string, answerKey: string) {
    if (this.keysAreValid(questionKey, answerKey) && this.hasAnsweredPreviousQuestion(questionKey)) {
      this.answers.set(questionKey, answerKey);
    }
  }

  private keysAreValid(questionKey: string, answerKey: string): boolean {
    return this.hasLoadedQuestions && !!this.questions[questionKey] && !!this.questions[questionKey].options[answerKey];
  }

  private hasAnsweredPreviousQuestion(questionKey: string): boolean {
    const keys = Object.keys(this.questions);
    const i = keys.indexOf(questionKey);
    return i === 0 ? true : !!this.answers.get(keys[i - 1]);
  }

  saveAnswers(): Observable<any> {
    if (!this.hasAnsweredAllQuestions) {
      return;
    }

    return this.apiWealthManagementsService.saveInvestorTestScore(null, this.totalScore);
  }
}
