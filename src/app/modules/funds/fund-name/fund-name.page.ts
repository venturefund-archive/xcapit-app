import { Component, OnInit } from '@angular/core';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-name',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profiles/success"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'funds.fund_name.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <div class="ux_content">
          <div class="fn__title">
            <app-ux-title>{{ 'funds.fund_name.title' | translate }}</app-ux-title>
          </div>
          <div class="fn__text_before">
            <app-ux-text class="ux-font-header-titulo">
              {{ 'funds.fund_name.text_before' | translate }}
            </app-ux-text>
          </div>
          <div class="fn__ak_input">
            <app-ux-input
              controlName="fund_name"
              type="text"
              inputmode="text"
              [label]="'funds.fund_name.fund_name' | translate"
              [placeholder]="'funds.fund_name.fund_name_placeholder' | translate"
            ></app-ux-input>
          </div>
        </div>
        <div class="ux_footer">
          <div class="fn__submit_button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Save Fund Name"
              type="submit"
              color="secondary"
              size="large"
              [disabled]="this.submitButtonService.isDisabled | async"
            >
              {{ 'funds.fund_name.next_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./fund-name.page.scss'],
})
export class FundNamePage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    fund_name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9]*')],
    ],
  });

  constructor(
    public submitButtonService: SubmitButtonService,
    private fundDataStorage: FundDataStorageService,
    private formBuilder: FormBuilder,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.fundDataStorage.getData('fundName').then((data) => {
      if (data) {
        this.form.patchValue(data);
      }
    });
  }

  handleSubmit() {
    if (this.form.valid) {
      this.fundDataStorage.setData('fundName', this.form.value);
      this.fundDataStorage.setData('fundRenew', false);
      this.navController.navigateForward(['funds/fund-investment']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
