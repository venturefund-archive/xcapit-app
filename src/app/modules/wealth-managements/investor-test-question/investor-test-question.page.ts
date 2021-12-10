import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-investor-test-question',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wealth-management/investor-test-options"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wealth_management.investor_test.header' | translate }}</ion-title>
        <ion-label class="step_counter" slot="end"
          >{{ this.currentQuestionNumber }} {{ 'shared.step_counter.of' | translate }}
          {{ this.totalNumberOfQuestions }}</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="it">
        <app-ux-step-progress-bar [progress]="this.progress"> </app-ux-step-progress-bar>
        <div class="it__question">
          <ion-text> </ion-text>
        </div>
        <div class="it__answers"></div>
        <div class="it__next_button">
          <ion-button> </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./investor-test-question.page.scss'],
})
export class InvestorTestQuestionPage implements OnInit {
  question: any;
  currentQuestionKey: string;
  currentQuestionNumber: number;
  //this.selectMode = this.route.snapshot.paramMap.get('mode') === 'select';
  totalNumberOfQuestions: number;

  get progress(): string {
    if (this.currentQuestionNumber > this.totalNumberOfQuestions || this.currentQuestionNumber < 1) {
      return '';
    }

    return `${(this.currentQuestionNumber / this.totalNumberOfQuestions) * 100}%`;
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionNumber === this.totalNumberOfQuestions;
  }

  constructor(private navController: NavController, private route: ActivatedRoute) {}

  ionViewWillEnter() {
    this.currentQuestionKey = this.route.snapshot.paramMap.get('question');
  }

  ngOnInit() {}

  calculateNumberOfQuestions() {}

  goToNextQuestion() {}

  goToPreviousQuestion() {
    this.currentQuestionNumber--;
  }

  loadQuestion(question: number) {}

  loadAnswer(question: string) {}
}
