import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Currency } from '../../enums/currency.enum';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-change-currency-modal',
  template: `
    <ion-content class="ion-padding">
      <form
        [formGroup]="this.form"
        (ngSubmit)="this.handleSubmit()"
        class="ux_main"
      >
        <div class="ux_content">
          <div class="cc__input">
            <app-ux-radio-group
              [label]="'funds.fund_currency.currency' | translate"
            >
              <ion-list>
                <ion-radio-group formControlName="currency">
                  <ion-item>
                    <ion-label>{{
                      'funds.fund_currency.btc_text' | translate
                    }}</ion-label>
                    <ion-radio
                      mode="md"
                      slot="start"
                      [value]="currencies.BTC"
                    ></ion-radio>
                  </ion-item>
                  <ion-item>
                    <ion-label>{{
                      'funds.fund_currency.usdt_text' | translate
                    }}</ion-label>
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
          <div class="cc__buttons">
            <div class="cc__back_button">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Cancel Change Currency"
                type="button"
                color="uxsecondary"
                size="large"
                fill="clear"
                (click)="this.cancel()"
              >
                {{ 'funds.change_currency_modal.cancel_button' | translate }}
              </ion-button>
            </div>
            <div class="cc__next_button">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Change Currency"
                type="submit"
                color="uxsecondary"
                size="large"
                [disabled]="!this.form.valid"
              >
                {{ 'funds.change_currency_modal.submit_button' | translate }}
              </ion-button>
            </div>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./change-currency-modal.component.scss']
})
export class ChangeCurrencyModalComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    currency: ['', [Validators.required]]
  });

  currencies = Currency;
  selected: string;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.form.setValue({ currency: this.selected });
  }

  handleSubmit() {
    this.modalController.dismiss(this.form.value);
  }

  cancel() {
    this.modalController.dismiss();
  }
}
