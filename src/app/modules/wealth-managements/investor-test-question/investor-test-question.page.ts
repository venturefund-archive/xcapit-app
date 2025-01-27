import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import {
  Answer,
  Question,
} from '../shared-wealth-managements/services/api-wealth-managements/api-wealth-managements.service';
import { InvestorTestService } from '../shared-wealth-managements/services/investor-test/investor-test.service';

@Component({
  selector: 'app-investor-test-question',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__left">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="" (click)="this.goToPreviousQuestion()" name="back"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wealth_managements.investor_test.header' | translate }}</ion-title>
        <ion-label class="ux_toolbar__step" slot="end" *ngIf="this.investorTestService.hasLoadedQuestions"
          >{{ this.currentQuestionNumber }} {{ 'shared.step_counter.of' | translate }}
          {{ this.totalNumberOfQuestions }}</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="it" *ngIf="this.investorTestService.hasLoadedQuestions && !!this.question">
        <app-ux-step-progress-bar [progress]="this.progress"></app-ux-step-progress-bar>
        <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
          <div class="it__question">
            <ion-text name="Question" class="ux-font-text-base">{{ this.question.text }}</ion-text>
          </div>
          <div class="it__answers">
            <app-ux-radio-item-group
              [labels]="this.answersLabels"
              [values]="this.question.options"
              [controlName]="'answer'"
            ></app-ux-radio-item-group>
          </div>
          <div class="it__submit_button">
            <ion-button
              appTrackClick
              name="Submit"
              class="ux_button"
              type="submit"
              color="secondary"
              [disabled]="this.submitButtonService.isDisabled && !this.form.valid"
              >{{ this.buttonText | translate }}</ion-button
            >
          </div>
        </form>
      </div>
    </ion-content>
  `,
  styleUrls: ['./investor-test-question.page.scss'],
})
export class InvestorTestQuestionPage {
  question: Question;
  currentQuestionNumber: number;
  mode: string;
  form: UntypedFormGroup = this.formBuilder.group({
    answer: ['', [Validators.required]],
  });

  private get baseRoute(): string {
    return '/wealth-management/investor-test';
  }

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

  get answers(): Answer[] {
    return this.question.options;
  }

  get answersLabels(): string[] {
    return this.question.options.map((a: Answer) => a.text);
  }

  get buttonText(): string {
    return `wealth_managements.investor_test.${this.isLastQuestion ? 'submit_button' : 'next_button'}`;
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
    public investorTestService: InvestorTestService,
    public submitButtonService: SubmitButtonService,
    private formBuilder: UntypedFormBuilder
  ) {}

  ionViewWillEnter() {
    this.currentQuestionNumber = parseInt(this.route.snapshot.paramMap.get('question'));
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.loadQuestions().then(() => {
      if (this.isValidQuestionNumber && !this.isUserSkippingQuestions) {
        this.loadQuestionAndAnswers();
      } else {
        this.navController.navigateRoot([`${this.baseRoute}/${this.mode}/1`]);
      }
    });
  }

  async loadQuestions() {
    return this.isFirstQuestion && !(await this.investorTestService.questionsInUserLanguage())
      ? this.investorTestService.loadQuestions()
      : Promise.resolve();
  }

  goToNextQuestion() {
    this.navController.navigateForward([`${this.baseRoute}/${this.mode}/${this.currentQuestionNumber + 1}`]);
  }

  goToPreviousQuestion() {
    if (this.isFirstQuestion) {
      this.investorTestService.clearAnswers();
      this.navController.navigateBack([
        this.mode === 'defi' ? 'tabs/wallets' : 'wealth-management/investor-test-options',
      ]);
    }
  }

  handleSubmit() {
    this.investorTestService.setAnswer(this.question, this.form.value.answer);
    if (this.isLastQuestion) {
      this.investorTestService.saveAnswers().subscribe(() => {
        this.investorTestService.clearAnswers();
        this.goToSuccessPage();
      });
    } else {
      this.goToNextQuestion();
    }
  }

  goToSuccessPage() {
    this.navController.navigateForward(['/wealth-management/success-investor-test']);
  }

  loadQuestionAndAnswers() {
    this.question = this.investorTestService.getQuestionByNumber(this.currentQuestionNumber);

    if (this.investorTestService.hasAnsweredQuestion(this.currentQuestionNumber)) {
      const answer = this.investorTestService.getAnswerByQuestion(this.question);
      this.form.patchValue({ answer });
    }
  }
}
