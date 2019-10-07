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
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/referrals/list"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'referrals.new_referral.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding-top">
      <app-referral-form (send)="this.handleSubmit($event)">
        <div class="submit-button">
          <div class="ion-padding-top ion-margin-top">
            <ion-button
              appTrackClick
              name="Save Referral"
              expand="full"
              size="large"
              type="submit"
              color="success"
              [disabled]="
                !this.formComponent.form.valid ||
                (this.submitButtonService.isDisabled | async)
              "
            >
              <ion-icon slot="start" name="checkmark-circle-outline"></ion-icon>
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
  ) {}

  ngOnInit() {}

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
