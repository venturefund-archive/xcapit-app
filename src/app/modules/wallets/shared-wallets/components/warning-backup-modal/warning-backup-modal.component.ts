import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-warning-backup-modal',
  template: `
    <div class="modal-content">
      <div class="main__close_button">
        <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
          <ion-icon class="main__close_button__icon" name="ux-close" color="primary"></ion-icon>
        </ion-button>
      </div>
      <div class="main__body">
        <div class="header__ux_info_phrase_image">
          <img src="assets/img/wallets/warning-backup.svg" />
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
            name="ux_go_to_protect"
            color="secondary"
            size="large"
            appTrackClick
            (click)="this.backup()"
          >
            {{ 'wallets.shared_wallets.warning_backup_info.button_protect' | translate }}
          </ion-button>
          <ion-button
            class="ux-link-xl main__actions__button ion-no-margin"
            name="ux_create_skip"
            fill="clear"
            size="large"
            appTrackClick
            (click)="this.skip()"
          >
            {{ 'wallets.shared_wallets.warning_backup_info.button_skip' | translate }}
          </ion-button>
        </div>
        <ion-content [scrollY]="true">
          <div class="main__body">
            <div class="header__ux_info_phrase_image">
              <img src="assets/img/wallets/warning-backup.svg" />
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
                name="Backup"
                color="secondary"
                size="large"
                (click)="this.backup()"
              >
                {{ 'wallets.shared_wallets.warning_backup_info.button_protect' | translate }}
              </ion-button>
              <ion-button
                class="ux-link-xl main__actions__button ion-no-margin"
                name="Skip"
                fill="clear"
                size="large"
                (click)="this.skip()"
              >
                {{ 'wallets.shared_wallets.warning_backup_info.button_skip' | translate }}
              </ion-button>
            </div>
          </div>
        </ion-content>
      </div>
    </div>
  `,
  styleUrls: ['./warning-backup-modal.component.scss'],
})
export class WarningBackupModalComponent implements OnInit {
  constructor(private modalController: ModalController, private navController: NavController) {}

  ngOnInit() {}

  backup() {
    this.navController.navigateForward(['wallets/recovery/read']);
    this.modalController.dismiss('backup');
  }

  close() {
    this.modalController.dismiss('close');
  }

  skip() {
    this.modalController.dismiss('skip');
  }
}
