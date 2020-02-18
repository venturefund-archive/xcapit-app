import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { NavController } from '@ionic/angular';
import { Currency } from '../shared-funds/enums/currency.enum';

@Component({
  selector: 'app-fund-currency',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profiles/success"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'funds.fund_currency.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form
        [formGroup]="this.form"
        (ngSubmit)="this.handleSubmit()"
        class="ux_main"
      >
        <div class="ux_content">
          <div class="fc__title">
            <app-ux-title>{{
              'funds.fund_currency.title' | translate
            }}</app-ux-title>
          </div>
          <div class="fc__text_before">
            <app-ux-text>
              {{ 'funds.fund_currency.text_before' | translate }}
            </app-ux-text>
          </div>
          <div class="fc__input">
            <app-ux-radio-group
              [label]="'funds.fund_currency.currency' | translate"
            >
              <ion-list>
                <ion-radio-group formControlName="currency">
                  <ion-item>
                    <ion-label>{{ 'funds.fund_currency.btc_text' | translate }}</ion-label>
                    <ion-radio
                      mode="md"
                      slot="start"
                      [value]="currencies.BTC"
                    ></ion-radio>
                  </ion-item>
                  <ion-item>
                    <ion-label>{{ 'funds.fund_currency.usdt_text' | translate }}</ion-label>
                    <ion-radio
                      mode="md"
                      slot="start"
                      [value]="currencies.USDT"
                    ></ion-radio>
                  </ion-item>
                </ion-radio-group>
              </ion-list>
              <app-errors-form-item
                controlName="risk_level"
              ></app-errors-form-item>
            </app-ux-radio-group>
          </div>
        </div>
        <div class="ux_footer">
          <div class="fc__buttons">
            <div class="fc__back_button">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Back"
                type="button"
                color="uxsecondary"
                size="large"
                fill="clear"
                routerLink="/funds/fund-name"
                routerDirection="backward"
              >
                {{ 'funds.fund_currency.back_button' | translate }}
              </ion-button>
            </div>
            <div class="fc__next_button">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Save Fund Risk"
                type="submit"
                color="uxsecondary"
                size="large"
                [disabled]="!this.form.valid"
              >
                {{ 'funds.fund_currency.next_button' | translate }}
              </ion-button>
            </div>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./fund-currency.page.scss']
})
export class FundCurrencyPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    currency: ['', [Validators.required]]
  });
  currencies = Currency;

  constructor(
    private fundDataStorage: FundDataStorageService,
    private formBuilder: FormBuilder,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.fundDataStorage
      .getData('fundCurrency')
      .then(data => this.form.patchValue(data));
  }

  handleSubmit() {
    if (this.form.valid) {
      this.fundDataStorage.setData('fundCurrency', this.form.value);
      this.navController.navigateForward(['funds/fund-take-profit']);
    }
  }
}
