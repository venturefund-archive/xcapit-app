import { ApiProfilesService } from './../../profiles/shared-profiles/services/api-profiles/api-profiles.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ApiWealthManagementsService } from '../shared-wealth-managements/services/api-wealth-managements/api-wealth-managements.service';

@Component({
  selector: 'app-success-investor-test',
  template: ` <ion-content class="ion-padding">
    <div class="main">
      <div class="main__close_button">
        <ion-button appTrackClick fill="clear" name="Close" (click)="this.close()">
          <ion-icon class="main__close_button__icon" name="ux-close" color="uxsemidark"></ion-icon>
        </ion-button>
      </div>
      <div class="main__ux_success_image">
        <img src="../../../../assets/img/wealth_management/success.svg" />
      </div>
      <div class="main__primary_text ux-font-text-xl">
        <ion-text>{{ 'wealth_managements.success.textPrimary' | translate: { testResult: this.testResult } }}</ion-text>
      </div>
      <div class="main__actions">
        <div class="main__actions__primary">
          <ion-button appTrackClick color="uxsecondary" class="ux_button" name="Continue" (click)="this.continue()">
            {{ 'wealth_managements.success.namePrimaryAction' | translate }}
          </ion-button>
        </div>
      </div>
      <div class="main__actions__secondary">
        <ion-button
          class="action_secondary ux-link-xl underline"
          appTrackClick
          fill="clear"
          name="Go To Home"
          (click)="this.goToHome()"
        >
          {{ 'wealth_managements.success.nameSecondaryAction' | translate }}
        </ion-button>
      </div>
    </div>
  </ion-content>`,
  styleUrls: ['./success-investor-test.page.scss'],
})
export class SuccessInvestorTestPage implements OnInit {
  data: any;
  testResult: any;
  constructor(
    private navController: NavController,
    private apiProfilesService: ApiProfilesService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.apiProfilesService.crud.get().subscribe((profile) => {
      this.testResult = this.translateService.instant(profile.investor_category);
    });
  }

  continue() {
    this.navController.navigateForward(['']);
  }

  close() {
    this.navController.navigateBack(['/tabs/home']);
  }

  goToHome() {
    this.navController.navigateBack(['/tabs/home']);
  }
}
