import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';

@Component({
  selector: 'app-new-investment',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'Nueva inversión' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card class="ux-card">
        <app-expandable-investment-info></app-expandable-investment-info>
      </ion-card>
      <ion-card class="ux-card">
        <form [formGroup]="this.form">
          <app-amount-input-card></app-amount-input-card>
        </form>
      </ion-card>
      <ion-button
        appTrackClick
        name="Submit Amount"
        expand="block"
        size="large"
        type="submit"
        class="ion-padding-start ion-padding-end ux_button"
        color="uxsecondary"
        [disabled]="this.submitButtonService.isDisabled | async"
      >
        {{ 'Continuar' | translate }}
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./new-investment.page.scss'],
})
export class NewInvestmentPage implements OnInit {
  data: any;
  form: FormGroup = this.formBuilder.group({
    amount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    referenceAmount: ['', [Validators.required]],
  });
  constructor(private formBuilder: FormBuilder, public submitButtonService: SubmitButtonService) {}

  ngOnInit() {}

  ionViewWillEnter() {}
}
