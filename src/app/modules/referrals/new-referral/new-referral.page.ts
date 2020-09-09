import { Component, OnInit, ViewChild } from '@angular/core';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ReferralFormComponent } from './components/referral-form/referral-form.component';
import { ApiReferralsService } from '../shared-referrals/services/api-referrals/api-referrals.service';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-new-referral',
  template: `
      <ion-header>
          <ion-toolbar color="uxprimary" class="ux_toolbar">
              <ion-buttons slot="start">
                  <ion-back-button defaultHref="/referrals/list"></ion-back-button>
              </ion-buttons>
              <ion-title class="ion-text-center">{{ 'referrals.new_referral.header' | translate }}</ion-title>
          </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding-top">
          <div class="nr__image-container">
              <img class="nr__image-container__image" src="assets/img/referrals/new-referral.png" alt="new-referral">
          </div>
          <div class="nr__title">
              <ion-text
                      class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22"
                      color="uxdark">
                  {{'referrals.new_referral.referral_title' | translate}}
              </ion-text>
          </div>
          <div class="nr__subtitle ion-padding-start ion-padding-end">
              <ion-text
                      class="ux-font-lato ux-fweight-regular ux-fsize-14"
                      color="uxsemidark">
                  {{'referrals.new_referral.referral_subtitle' | translate}}
              </ion-text>
          </div>
          <app-referral-form class="nr__form" (send)="this.handleSubmit($event)">
              <div class="submit-button">
                  <div class="nr__submit-button ion-padding-start ion-padding-end ion-padding-top">
                      <ion-button
                              appTrackClick
                              name="Save Referral"
                              class="ux_button"
                              size="large"
                              type="submit"
                              color="uxsecondary"
                              [disabled]="!this.formComponent.form.valid"
                      >
                          {{ 'referrals.new_referral.submit_button' | translate }}
                      </ion-button>
                  </div>
              </div>
          </app-referral-form>
      </ion-content>
  `,
  styleUrls: ['./new-referral.page.scss']
})
export class NewReferralPage implements OnInit {
  @ViewChild(ReferralFormComponent, { static: true })
  formComponent: ReferralFormComponent;

  constructor(
    public submitButtonService: SubmitButtonService,
    private apiReferrals: ApiReferralsService,
    private navController: NavController,
    private toast: ToastService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
  }

  handleSubmit(data: any) {
    this.apiReferrals.crud.create(data).subscribe(() => this.success());
  }

  async success() {
    this.navController.navigateBack(['/referrals/list']).then(() => {
      this.formComponent.form.reset();
      this.toast.showToast({
        header: this.translate.instant('referrals.new_referral.toast_header'),
        message: this.translate.instant('referrals.new_referral.toast_message')
      });
    });
  }
}
