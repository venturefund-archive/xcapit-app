import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
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
        <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
          <div class="it__question">
            <ion-text name="Question" class="ux-font-text-base">{{ this.question.text }}</ion-text>
          </div>
          <div class="it__answers">
            <app-ux-radio-item-group
              [labels]="this.answersLabels"
              [values]="this.answersKeys"
              [controlName]="'answer'"
            ></app-ux-radio-item-group>
          </div>
          <div class="it__next_button">
            <ion-button name="Submit" type="submit">{{ this.buttonText | translate }}</ion-button>
          </div>
        </form>
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
  form: FormGroup = this.formBuilder.group({
    answer: ['', [Validators.required]],
  });

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

  // TODO: this aren't properties
  get answers(): any {
    return Object.values(this.question.options);
  }

  get answersKeys(): any {
    return Object.keys(this.question.options);
  }

  get answersLabels(): any {
    return Object.values(this.question.options).map((a: any) => a.text);
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
    public investorTestService: InvestorTestService,
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder
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
    this.navController.navigateForward([`${this.baseRoute}/${this.currentQuestionNumber + 1}`]);
  }

  goToPreviousQuestion() {
    if (this.isFirstQuestion) {
      this.investorTestService.cancel();
    }
  }

  handleSubmit() {
    this.investorTestService.setAnswer(this.currentQuestionKey, this.form.value.answer);

    if (this.isLastQuestion) {
      this.investorTestService.saveAnswers().subscribe(() => {
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
    this.currentQuestionKey = this.investorTestService.getQuestionKeyByNumber(this.currentQuestionNumber);
    this.question = this.investorTestService.getQuestionByKey(this.currentQuestionKey);

    if (this.investorTestService.hasAnsweredQuestion(this.currentQuestionNumber)) {
      const answer = this.investorTestService.getAnswerKeyByQuestionKey(this.currentQuestionKey);
      this.form.patchValue({ answer });
    }
  }
}
