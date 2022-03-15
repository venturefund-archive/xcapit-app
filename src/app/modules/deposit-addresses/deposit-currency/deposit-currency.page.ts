import { Component, OnInit } from '@angular/core';
import { Currency } from 'src/app/modules/funds/shared-funds/enums/currency.enum';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-deposit-currency',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'deposit_addresses.deposit_currency.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <div class="ux_content">
          <app-ux-title class="ion-padding-top ion-margin-top">
            <div class="ion-margin-top">
              {{ 'deposit_addresses.deposit_currency.title' | translate }}
            </div>
          </app-ux-title>

          <app-ux-text class="ion-padding-top ion-margin-top">
            <div class="ion-margin-top">
              {{ 'deposit_addresses.deposit_currency.text_before' | translate }}
            </div>
          </app-ux-text>

          <app-ux-radio-group [label]="'deposit_addresses.deposit_currency.currency_title' | translate">
            <ion-list>
              <ion-radio-group formControlName="currency">
                <div class="container">
                  <ion-item>
                    <ion-label>{{ this.currencyEnum.BTC }}</ion-label>
                    <ion-radio mode="md" slot="start" [value]="this.currencyEnum.BTC"></ion-radio>
                  </ion-item>
                  <ion-item>
                    <ion-label>{{ this.currencyEnum.USDT }}</ion-label>
                    <ion-radio mode="md" slot="start" [value]="this.currencyEnum.USDT"></ion-radio>
                  </ion-item>
                </div>
              </ion-radio-group>
            </ion-list>
            <app-errors-form-item controlName="currency"></app-errors-form-item>
          </app-ux-radio-group>
        </div>

        <div class="ux_footer">
          <div class="dc__next_button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Next"
              type="submit"
              color="secondary"
              size="large"
              [disabled]="this.submitButtonService.isDisabled | async"
            >
              {{ 'deposit_addresses.deposit_currency.next_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./deposit-currency.page.scss'],
})
export class DepositCurrencyPage implements OnInit {
  currencyEnum = Currency;
  form: FormGroup = this.formBuilder.group({
    currency: ['BTC', [Validators.required]],
  });

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private navController: NavController
  ) {}

  ngOnInit() {}

  handleSubmit() {
    if (this.form.valid) {
      this.navController.navigateForward(['deposits/address/', this.form.value.currency]);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
