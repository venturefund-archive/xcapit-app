import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { UX_ALERT_TYPES } from 'src/app/shared/components/ux-alert-message/ux-alert-types';

@Component({
  selector: 'app-fund-duration',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/fund-risk"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'funds.fund_duration.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <div class="ux_content">
          <div class="fd__title">
            <app-ux-title>{{ 'funds.fund_duration.title' | translate }}</app-ux-title>
          </div>
          <div class="fd__text_before">
            <app-ux-text>
              {{ 'funds.fund_duration.text_before' | translate }}
            </app-ux-text>
          </div>
          <div class="fd__input">
            <app-ux-range
              min="30"
              max="120"
              [minText]="'funds.fund_duration.duration_metric' | translate"
              [maxText]="'funds.fund_duration.duration_metric' | translate"
              [label]="'funds.fund_duration.duration' | translate"
              controlName="cantidad_dias"
            >
              <ion-item>
                <ion-range formControlName="cantidad_dias" mode="md" min="30" max="120" step="10" ticks="true">
                </ion-range>
              </ion-item>
            </app-ux-range>
          </div>
          <div class="fd__alert">
            <app-ux-alert-message [type]="this.alertType">
              {{ 'funds.fund_duration.text_help' | translate }}
            </app-ux-alert-message>
          </div>
        </div>
        <div class="ux_footer">
          <div class="fd__buttons">
            <div class="fd__back_button">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Back"
                type="button"
                color="uxsecondary"
                size="large"
                fill="clear"
                routerLink="/funds/fund-risk"
                routerDirection="backward"
              >
                {{ 'funds.fund_duration.back_button' | translate }}
              </ion-button>
            </div>
            <div class="fd__next_button">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Save Fund Duration"
                type="submit"
                color="uxsecondary"
                size="large"
                [disabled]="this.submitButtonService.isDisabled | async"
              >
                {{ 'funds.fund_duration.next_button' | translate }}
              </ion-button>
            </div>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./fund-duration.page.scss'],
})
export class FundDurationPage implements OnInit {
  alertType = UX_ALERT_TYPES.info;
  form: FormGroup = this.formBuilder.group({
    cantidad_dias: [30, [Validators.required, Validators.min(30)]],
  });
  constructor(
    public submitButtonService: SubmitButtonService,
    private fundDataStorage: FundDataStorageService,
    private formBuilder: FormBuilder,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.fundDataStorage.getData('fundDuration').then((data) => {
      if (data) {
        this.form.patchValue(data);
      }
    });
  }

  handleSubmit() {
    if (this.form.valid) {
      this.fundDataStorage.setData('fundDuration', this.form.value);
      this.navController.navigateForward(['funds/fund-currency']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
