import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MODULES_CRYPTO } from '../shared-financial-education/constants/crypto';
import { MODULES_FINANCE } from '../shared-financial-education/constants/finance';

@Component({
  selector: 'app-home-financial-education',
  template: `<ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'financial_education.home.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="header-background "></div>
      <div class="hfe__segments ion-padding-start ion-padding-end">
        <form [formGroup]="this.segmentsForm">
          <ion-segment mode="md" class="ux-segment" formControlName="tab">
            <ion-segment-button value="finance" name="ux_tab_finance" appTrackClick>
              <ion-label
                [ngClass]="{ 'active-tab': this.segmentsForm.value.tab === 'finance' }"
                class="ux-font-text-xl"
                >{{ 'financial_education.home.finance' | translate }}</ion-label
              >
            </ion-segment-button>
            <ion-segment-button value="crypto" name="ux_tab_crypto" appTrackClick>
              <ion-label
                [ngClass]="{ 'active-tab': this.segmentsForm.value.tab === 'crypto' }"
                class="ux-font-text-xl"
                >{{ 'financial_education.home.crypto' | translate }}</ion-label
              >
            </ion-segment-button>
          </ion-segment>
        </form>
      </div>
      <div
        class="hfe__content_card"
        [ngClass]="this.segmentsForm.value.tab === 'finance' ? 'non-radius-left' : 'non-radius-right'"
      >
        <div class="ion-padding">
          <ion-text class="ux-font-text-lg">{{ 'financial_education.home.title' | translate }}</ion-text>
        </div>
        <app-modules-education
          class="hfe__content_card__modules"
          *ngFor="let module of this.modules"
          [module]="module"
          [selectedTab]="this.segmentsForm.value.tab"
        ></app-modules-education>
      </div>
      <div class="hfe__rule_card">
        <ion-text class="ux-font-text-lg">{{'financial_education.home.rules_title' | translate}}</ion-text>
        <app-rule-card
          [title]="'financial_education.shared.rule_card.rule_1.title'"
          [subtitle]="'financial_education.shared.rule_card.rule_1.subtitle'"
          [url]="'financial-education/introduction/explanation'"
        ></app-rule-card>
      </div>
    </ion-content>
    `,
  styleUrls: ['./home-financial-education.page.scss'],
})
export class HomeFinancialEducationPage {
  segmentsForm: FormGroup = this.formBuilder.group({
    tab: ['finance', [Validators.required]],
  });
  modules: any = MODULES_FINANCE;

  constructor(private formBuilder: FormBuilder) {}

  ionViewWillEnter() {
    this.segmentsForm.valueChanges.subscribe(() => {
      this.modules = this.segmentsForm.value.tab === 'finance' ? MODULES_FINANCE : MODULES_CRYPTO;
    });
  }
}
