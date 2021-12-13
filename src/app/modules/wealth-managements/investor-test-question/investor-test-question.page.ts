import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { InvestorTestService } from '../shared-wealth-managements/services/investor-test/investor-test.service';

@Component({
  selector: 'app-investor-test-question',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="/wealth-management/investor-test-options"
            (click)="this.goToPreviousQuestion()"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wealth_management.investor_test.header' | translate }}</ion-title>
        <ion-label class="step_counter" slot="end" *ngIf="this.investorTestService.hasLoadedQuestions"
          >{{ this.currentQuestionNumber }} {{ 'shared.step_counter.of' | translate }}
          {{ this.totalNumberOfQuestions }}</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="it" *ngIf="this.investorTestService.hasLoadedQuestions && !!this.question">
        <app-ux-step-progress-bar [progress]="this.progress"></app-ux-step-progress-bar>
        <div class="it__question">
          <ion-text name="Question">{{ this.question.text }}</ion-text>
        </div>
        <div class="it__answers">
          <div class="it__answers__option" *ngFor="let answer of this.answers">
            <ion-text name="Option">{{ answer.text }}</ion-text>
          </div>
        </div>
        <div class="it__next_button">
          <ion-button name="Submit" (click)="this.goToNextQuestion()">{{ this.buttonText | translate }}</ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./investor-test-question.page.scss'],
})
export class InvestorTestQuestionPage implements OnInit {
  private baseRoute = '/wealth-management/investor-test';
  question: any;
  currentQuestionKey: string;
  currentQuestionNumber: number;

  get totalNumberOfQuestions(): number {
    return this.investorTestService.totalNumberOfQuestions;
  }

  get progress(): string {
    return `${(this.currentQuestionNumber / this.totalNumberOfQuestions) * 100}%`;
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionNumber === this.totalNumberOfQuestions;
  }

  get isFirstQuestion(): boolean {
    return this.currentQuestionNumber === 1;
  }

  get answers(): any {
    return Object.values(this.question.options);
  }

  get buttonText(): string {
    return `wealth_management.investor_test.${this.isLastQuestion ? 'submit_button' : 'next_button'}`;
  }

  get isValidQuestionNumber(): boolean {
    return (
      !Number.isNaN(this.currentQuestionNumber) &&
      this.currentQuestionNumber <= this.totalNumberOfQuestions &&
      this.currentQuestionNumber >= 1
    );
  }

  get isUserSkippingQuestions(): boolean {
    return !(this.isFirstQuestion || this.investorTestService.hasAnsweredQuestion(this.currentQuestionNumber - 1));
  }

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    public investorTestService: InvestorTestService
  ) {}

  ionViewWillEnter() {
    this.investorTestService.loadQuestions();
    this.currentQuestionNumber = parseInt(this.route.snapshot.paramMap.get('question'));

    if (this.isValidQuestionNumber && !this.isUserSkippingQuestions) {
      this.loadQuestionAndAnswers();
    } else {
      this.navController.navigateRoot([`${this.baseRoute}/1`]);
    }
  }

  ngOnInit() {}

  goToNextQuestion() {
    this.investorTestService.setAnswer(this.currentQuestionKey, 'opcion1');
    this.navController.navigateForward([`${this.baseRoute}/${this.currentQuestionNumber + 1}`]);
  }

  goToPreviousQuestion() {
    if (this.isFirstQuestion) {
      this.investorTestService.cancel();
    }
  }

  loadQuestionAndAnswers() {
    this.currentQuestionKey = this.investorTestService.getQuestionKeyByNumber(this.currentQuestionNumber);
    this.question = this.investorTestService.getQuestionByKey(this.currentQuestionKey);

    if (this.investorTestService.hasAnsweredQuestion(this.currentQuestionNumber)) {
      console.log(this.investorTestService.getAnswerKeyByQuestionKey(this.currentQuestionKey));
    }
  }
}
