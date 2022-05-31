import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home-financial-education',
  template: `<ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'financial_education.introduction.financial_freedom.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="header-background"></div>
      <div class="hfe__segments ion-padding-start ion-padding-end">
        <form [formGroup]="this.segmentsForm">
          <ion-segment mode="md" class="ux-segment" formControlName="tab">
            <ion-segment-button value="finance" name="ux_tab_tokens" appTrackClick>
              <ion-label [ngClass]="{ 'active-tab': this.segmentsForm.value.tab === 'finance' }" class="ux-font-text-xl"
                >Finanzas</ion-label
              >
            </ion-segment-button>
            <ion-segment-button value="crypto" name="ux_tab_nfts" appTrackClick>
              <ion-label [ngClass]="{ 'active-tab': this.segmentsForm.value.tab === 'crypto' }" class="ux-font-text-xl"
                >Crypto</ion-label
              >
            </ion-segment-button>
          </ion-segment>
        </form>
      </div>
    </ion-content>`,
  styleUrls: ['./home-financial-education.page.scss'],
})
export class HomeFinancialEducationPage implements OnInit {
  segmentsForm: FormGroup = this.formBuilder.group({
    tab: ['finance', [Validators.required]],
  });
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {}
}
