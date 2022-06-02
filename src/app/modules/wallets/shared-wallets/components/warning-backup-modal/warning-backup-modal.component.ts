import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-warning-backup-modal',
  template: `
  <div class="main__close_button">
    <ion-button
      class="ion-no-padding"
      slot="icon-only"
      fill="clear"
      name="Close"
      (click)="this.close()"
    >
      <ion-icon class="main__close_button__icon" name="ux-close" color="primary"></ion-icon>
    </ion-button>
  </div>
  <div class="main__body">
    <div class="header__ux_info_phrase_image">
      <img src="assets/img/wallets/warning-backup.svg"/>
    </div>
    <div class="main__body__content">
      <ion-label class="ux-font-text-lg main__body__content__title"
        >{{ 'wallets.shared_wallets.warning_backup_info.title' | translate }}
      </ion-label>
      <ion-label class="ux-font-text-lg main__body__content__title__body"
        >{{ 'wallets.shared_wallets.warning_backup_info.title2' | translate }}
      </ion-label>
      <ion-label color="primary" class="ion-no-margin ux-font-text-base main__body__content__description">
        {{ 'wallets.shared_wallets.warning_backup_info.description' | translate }}
      </ion-label>
    </div>
    <div class="main__actions">
      <ion-button
        class="ux_button main__actions__button ion-no-margin"
        name="Understood"
        color="secondary"
        size="large"
        (click)="this.close()"
      >
        {{ 'wallets.shared_wallets.warning_backup_info.button_protect' | translate }}
      </ion-button>
      <ion-button
        class="ux-link-xl main__actions__button ion-no-margin"
        name="Understood"
        fill="clear"
        size="large"
        (click)="this.skip()"
      >
        {{ 'wallets.shared_wallets.warning_backup_info.button_skip' | translate }}
      </ion-button>
    </div>
  </div>
  `,
  styleUrls: ['./warning-backup-modal.component.scss'],
})
export class WarningBackupModalComponent implements OnInit {

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {}

  close() {
    this.modalController.dismiss(false);
  }

  skip() {
    this.modalController.dismiss(true);
  }

}
