import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-operation-km-in-progress-modal',
  template:`<div class="header">
  <div class="header__close-button" *ngIf="this.data.urlClose">
    <ion-button
      fill="clear"
      name="Close Success"
      (click)="this.close()"
    >
      <ion-icon class="header__close_button__icon" name="ux-close" color="neutral80"></ion-icon>
    </ion-button>
  </div>
  <div class="header__img">
    <img [src]="this.data?.image" alt="Operation Image"/>
  </div>
  
</div>
<div class="main">
  <div class="main__icon">
    <img [src]="this.data?.icon" alt="Operation Icon"/>
  </div>
  <div class="main__primary-title">
    <ion-text>{{ this.data?.titlePrimary | translate }}</ion-text>
  </div>
  <div class="main__badge">
    <ion-badge>{{ this.data?.textBadge | translate }}</ion-badge>
  </div>
  <div class="main__primary-text">
    <app-ux-title>{{ this.data?.textPrimary | translate }}</app-ux-title>
  </div>
  <div class="main__secondary-text">
    <ion-text class="ux-font-text-base">{{ this.data?.textSecondary | translate }}</ion-text>
  </div>
</div>
<ion-footer>
<div class="main__actions">
  <div class="main__actions__primary">
    <ion-button
      class="ux_button"
      color="secondary"
      name="Success Action Primary"
      (click)="this.primaryAction()"
    >
      {{ this.data?.namePrimaryAction | translate }}
    </ion-button>
  </div>
</div>
</ion-footer>
  `,
  styleUrls: ['./operation-km-in-progress-modal.component.scss'],
})
export class OperationKmInProgressModalComponent implements OnInit {
  data = SUCCESS_TYPES.operation_km_in_progress;
  constructor(private navController: NavController, private trackService: TrackService, private modalController: ModalController) {}

  ngOnInit() {
    this.trackPage();
  }

  private trackPage() {
    // this.trackService.trackEvent({
    //   eventAction: 'screenview',
    //   description: window.location.href,
    //   //eventLabel: 'ux_swap_screenview_success',
    // });
  }

  primaryAction() {
    if (this.data.urlPrimaryAction) {
      this.navController.navigateForward([this.data.urlPrimaryAction]);
      this.modalController.dismiss();
    }
  }

  close() {
    this.navController.navigateForward([this.data.urlClose]);
    this.modalController.dismiss();
  }

}
