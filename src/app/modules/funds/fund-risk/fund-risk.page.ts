import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-risk',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/fund-name"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'funds.fund_risk.header' | translate
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
          <div class="fr__title">
            <app-ux-title>{{
              'funds.fund_risk.title' | translate
            }}</app-ux-title>
          </div>
          <div class="fr__text_before">
            <app-ux-text>
              {{ 'funds.fund_risk.text_before' | translate }}
            </app-ux-text>
          </div>
          <div class="fr__input">
            <app-ux-radio-group
              [label]="'funds.fund_risk.risk_level' | translate"
            >
              <ion-list>
                <ion-radio-group formControlName="risk_level">
                  <ion-item *ngFor="let rl of this.riskLevels">
                    <ion-label>{{ rl.name | translate }}</ion-label>
                    <ion-radio
                      mode="md"
                      slot="start"
                      [value]="rl.value"
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
          <div class="fr__buttons">
            <div class="fr__back_button">
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
                {{ 'funds.fund_risk.back_button' | translate }}
              </ion-button>
            </div>
            <div class="fr__next_button">
              <ion-button
                class="ux_button"
                appTrackClick
                name="Save Fund Risk"
                type="submit"
                color="uxsecondary"
                size="large"
                [disabled]="!this.form.valid"
              >
                {{ 'funds.fund_risk.next_button' | translate }}
              </ion-button>
            </div>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./fund-risk.page.scss']
})
export class FundRiskPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    risk_level: [
      '',
      [Validators.required]
    ]
  });

  riskLevels = [
    { name: 'funds.fund_risk.risk_level_options.low', value: 'CLASSIC' },
    { name: 'funds.fund_risk.risk_level_options.mid', value: 'MID' },
    { name: 'funds.fund_risk.risk_level_options.high', value: 'PRO' }
  ];

  constructor(
    private fundDataStorage: FundDataStorageService,
    private formBuilder: FormBuilder,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.fundDataStorage
      .getData('fundRisk')
      .then(data => this.form.patchValue(data));
  }

  handleSubmit() {
    if (this.form.valid) {
      this.fundDataStorage.setData('fundRisk', this.form.value);
      this.navController.navigateForward(['funds/fund-duration']);
    }
  }
}
