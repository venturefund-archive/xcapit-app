import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TrackService } from '../../services/track/track.service';

@Component({
  selector: 'app-success-content',
  template: `
    <div class="main">
      <div class="main__close-button" *ngIf="this.data.urlClose">
        <ion-button
          fill="clear"
          appTrackClick
          name="Close Success"
          [dataToTrack]="{ eventLabel: this.data.trackClickEventNameCloseAction }"
          (click)="this.close()"
        >
          <ion-icon class="main__close_button__icon" name="ux-close" color="neutral80"></ion-icon>
        </ion-button>
      </div>
      <div class="main__ux-success-image" *ngIf="!this.data.bottomImage">
        <app-ux-center-img [imagePath]="this.data.image" [imageAlt]="this.imageAlt"></app-ux-center-img>
      </div>
      <div class="main__primary-text">
        <app-ux-title>{{ this.data?.textPrimary | translate }}</app-ux-title>
      </div>
      <div class="main__secondary-text ux-font-text-base">
        <ion-text class="ux-font-text-base">{{ this.data?.textSecondary | translate }}</ion-text>
      </div>
      <div class="main__ux-success-image" *ngIf="this.data.bottomImage">
        <app-ux-center-img [imagePath]="this.data.image" [imageAlt]="this.imageAlt"></app-ux-center-img>
      </div>
      <div class="main__actions">
        <div class="main__actions__primary">
          <ion-button
            class="ux_button"
            color="secondary"
            appTrackClick
            name="Success Action Primary"
            [dataToTrack]="{ eventLabel: this.data.trackClickEventNamePrimaryAction }"
            (click)="this.primaryAction()"
          >
            {{ this.data?.namePrimaryAction | translate }}
          </ion-button>
        </div>
        <div class="main__third_text ux-font-text-xxs">
          <ion-text color="neutral80">{{ this.data?.textThird | translate }}</ion-text>
        </div>
        <div class="main__actions__third" *ngIf="this.data.nameThirdAction">
          <ion-button
            class="ux-button-outlined"
            appTrackClick
            name="Success Action Third"
            [dataToTrack]="{ eventLabel: this.data.trackClickEventNameThirdAction }"
            (click)="this.thirdAction()"
          >
            {{ this.data?.nameThirdAction | translate }}
          </ion-button>
        </div>
        <div class="main__actions__secondary" *ngIf="this.data.nameSecondaryAction">
          <ion-button
            class="ux-font-button"
            color="info"
            appTrackClick
            fill="clear"
            [dataToTrack]="{ eventLabel: this.data.trackClickEventNameSecondaryAction }"
            name="Success Action Secondary"
            (click)="this.secondaryAction()"
          >
            {{ this.data?.nameSecondaryAction | translate }}
          </ion-button>
        </div>
      </div>
      <div class="main__disclaimer" *ngIf="this.data.disclaimer">
        <ion-text class="ux-font-text-xs">{{ this.data.disclaimer | translate }}</ion-text>
      </div>
      <div class="main__support" *ngIf="this.data?.hasWhatsappSupport">
        <app-whatsapp-support></app-whatsapp-support>
      </div>
    </div>
  `,
  styleUrls: ['./success-content.component.scss'],
})
export class SuccessContentComponent implements OnInit {
  calledAsModal: boolean;
  @Input() data: any;
  @Input() unauth: any = false;
  @Input() imageAlt = 'Success Image';
  @Output() primaryActionEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() secondaryActionEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() thirdActionEvent: EventEmitter<void> = new EventEmitter<void>();
  
  constructor(private navController: NavController, private trackService: TrackService, private modalController: ModalController) {}

  ngOnInit() {
    if (this.data.hasToTrackScreenview) {
      this.trackService.trackEvent({
        eventAction: 'screenview',
        description: window.location.href,
        eventLabel: this.data.screenviewEventLabel,
      });
    }
  }

  close() {
    this.navController.navigateRoot([this.data.urlClose], { animationDirection: 'forward' });
    this.dismiss();
  }

  primaryAction() {
    if (this.data.urlPrimaryAction) {
      this.navController.navigateRoot([this.data.urlPrimaryAction]);
      this.dismiss();
    }
    this.primaryActionEvent.emit();
  }

  secondaryAction() {
    if (this.data.urlSecondaryAction) {
      this.navController.navigateForward([this.data.urlSecondaryAction]);
    }
    this.secondaryActionEvent.emit();
  }

  thirdAction() {
    if (this.data.urlThirdAction) {
      this.navController.navigateForward([this.data.urlThirdAction]);
    }
    this.secondaryActionEvent.emit();
  }

  dismiss() {
    if (this.calledAsModal) {
      this.modalController.dismiss();
    }
  }
}
