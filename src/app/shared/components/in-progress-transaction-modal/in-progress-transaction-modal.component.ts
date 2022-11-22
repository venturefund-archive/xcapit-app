import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-in-progress-transaction-modal',
  template: `
    <div class="modal-content ipt">
      <div class="ipt__header">
        <div class="ipt__header__close-button" *ngIf="this.data?.urlClose">
          <ion-button fill="clear" name="Close Success" (click)="this.close()">
            <ion-icon class="header__close_button__icon" name="ux-close" color="neutral80"></ion-icon>
          </ion-button>
        </div>
        <div class="ipt__header__img">
          <img [src]="this.data?.image" alt="Image" />
        </div>
      </div>
      <div class="ipt__main">
        <div class="ipt__main__icon">
          <img [src]="this.data?.icon" alt="Icon" />
        </div>
        <div class="ipt__main__primary-title">
          <ion-text class="ux-font-text-xl">{{ this.data?.titlePrimary | translate }}</ion-text>
        </div>
        <div class="ipt__main__badge">
          <ion-badge>{{ this.data?.textBadge | translate }}</ion-badge>
        </div>
        <div class="ipt__main__primary-text">
          <app-ux-title>{{ this.data?.textPrimary | translate }}</app-ux-title>
        </div>
        <div class="ipt__main__secondary-text">
          <ion-text class="ux-font-text-base">{{ this.data?.textSecondary | translate }}</ion-text>
        </div>
      </div>
      <ion-footer class="ipt__footer">
        <div class="ipt__footer__actions">
          <div class="ipt__footer__actions__primary">
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
      </ion-footer>
    </div>
  `,
  styleUrls: ['./in-progress-transaction-modal.component.scss'],
})
export class InProgressTransactionModalComponent implements OnInit {
  data;
  constructor(private modalController: ModalController, private navController: NavController) {}

  ngOnInit() {}

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
