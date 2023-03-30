import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TrackService } from '../../services/track/track.service';
import { SUCCESS_TYPES } from '../success-content/success-types.constant';

@Component({
  selector: 'app-warranty-in-progress-transaction-modal',
  template: `
    <div class="modal-content wipt">
      <div class="wipt__header">
        <div class="wipt__header__close-button" *ngIf="this.data?.urlClose">
          <ion-button fill="clear" name="Close Success" (click)="this.close()">
            <ion-icon class="header__close_button__icon" name="ux-close" color="neutral80"></ion-icon>
          </ion-button>
        </div>
        <div class="wipt__header__img">
          <img [src]="this.data?.image" alt="Image" />
        </div>
      </div>
      <div class="wipt__main">
        <div class="wipt__main__icon">
          <img [src]="this.data?.icon" alt="Icon" />
          <div class="wipt__main__primary-text">
            <app-ux-title>{{ this.data?.textPrimary | translate }}</app-ux-title>
          </div>
          <div class="wipt__main__secondary-text">
            <ion-text class="ux-font-text-base">{{ this.data?.textSecondary | translate }}</ion-text>
          </div>
          <div class="wipt__main__operation" *ngIf="this.operationNumber">
            <ion-text class="ux-font-titulo-xs">{{ this.data?.textOperation | translate }}</ion-text>
            <ion-text class="ux-font-text-base-black"
              >{{ this.data?.numeration | translate }} {{ this.operationNumber }}</ion-text
            >
          </div>
        </div>

        <ion-footer class="wipt__footer">
          <div class="wipt__footer__actions">
            <div class="wipt__footer__actions__primary">
              <ion-button
                class="ux_button"
                color="secondary"
                expand="block"
                name="Success Action Primary"
                (click)="this.primaryAction()"
              >
                {{ this.data?.namePrimaryAction | translate }}
              </ion-button>
            </div>
          </div>
          <div class="wipt__footer__support">
            <app-whatsapp-support></app-whatsapp-support>
          </div>
        </ion-footer>
      </div>
    </div>
  `,
  styleUrls: ['./warranty-in-progress-transaction-modal.component.scss'],
})
export class WarrantyInProgressTransactionModalComponent implements OnInit {
  data: any;
  eventName: string;
  operationNumber: number;

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private trackService: TrackService
  ) {}

  ngOnInit() {
    this.data = SUCCESS_TYPES.warrant_success;
    this.trackScreenViewEvent();
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
    this.modalController.dismiss();
  }

  trackScreenViewEvent() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: `${this.eventName}`,
    });
  }
}
