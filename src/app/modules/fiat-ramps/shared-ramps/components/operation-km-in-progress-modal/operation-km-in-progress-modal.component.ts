import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-operation-km-in-progress-modal',
  template: ` <div class="modal-content">
    <div class="header">
      <div class="header__close-button" *ngIf="this.data.urlClose">
        <ion-button fill="clear" name="Close Success" (click)="this.close()">
          <ion-icon class="header__close_button__icon" name="ux-close" color="neutral80"></ion-icon>
        </ion-button>
      </div>
      <div class="header__img">
        <img [src]="this.data?.image" alt="Operation Image" />
      </div>
    </div>
    <div class="main">
      <div class="main__icon">
        <img [src]="this.data?.icon" alt="Operation Icon" />
      </div>
      <div class="main__primary-title">
        <ion-text>{{ this.data?.titlePrimary | translate }}</ion-text>
      </div>
      <div class="main__badge" [ngClass]="this.badgeStyle">
        <ion-badge>{{ this.data?.textBadge | translate }}</ion-badge>
      </div>
      <div class="main__primary-text">
        <app-ux-title>{{ this.data?.textPrimary | translate }}</app-ux-title>
      </div>
      <div class="main__secondary-text">
        <ion-text class="ux-font-text-base">{{ this.data?.textSecondary | translate }}</ion-text>
      </div>

      <div class="main__action">
        <div class="main__actions__primary">
          <ion-button class="ux_button" color="secondary" name="Success Action Primary" (click)="this.primaryAction()">
            {{ this.data?.namePrimaryAction | translate }}
          </ion-button>
        </div>
      </div>
      <div class="main__tertiary-text">
        <ion-text class="ux-font-text-base">{{ this.data?.textTertiary | translate }}</ion-text>
      </div>
      <ion-button
        class="main__open-support"
        name="kripton-tyc"
        (click)="this.openSupport()"
        appTrackClick
        fill="clear"
        size="small"
      >
        <ion-text class="ux-link-xs">{{ this.data?.textHelpLink | translate }}</ion-text>
      </ion-button>
    </div>
  </div>`,
  styleUrls: ['./operation-km-in-progress-modal.component.scss'],
})
export class OperationKmInProgressModalComponent implements OnInit {
  data;
  link = LINKS;
  badgeStyle: string;
  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private browserService: BrowserService,
    private trackService: TrackService
  ) {}

  ngOnInit() {
    if (this.data.hasToTrackScreenview) {
      this.trackService.trackEvent({
        eventAction: 'screenview',
        description: window.location.href,
        eventLabel: this.data.screenviewEventLabel,
      });
    }
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

  openSupport() {
    this.browserService.open({ url: this.link.kriptonPage });
  }
}
