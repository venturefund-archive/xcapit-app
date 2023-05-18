import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Component({
  selector: 'app-skip-backup-modal',
  template: ` <div class="modal-content">
    <div class="main__body">
      <form [formGroup]="skipBackUpForm" class="main__body__form">
        <div class="main__body__form__content">
          <ion-label class="ux-font-text-lg"
            >{{ 'wallets.shared_wallets.skip_backup_modal.title' | translate }}
          </ion-label>
          <ion-item class="last ux-font-text-base ion-no-padding" lines="none">
            <ion-label color="neutral90" class="ion-no-margin">
              {{ 'wallets.shared_wallets.skip_backup_modal.description' | translate }}
            </ion-label>
            <ion-checkbox mode="md" name="skipBackUp" formControlName="agreeSkipBackUp" slot="start"></ion-checkbox>
          </ion-item>
        </div>
        <div class="main__actions">
          <ion-button
            class="ux-link-xl main__actions__button main__actions__button-back"
            fill="clear"
            name="CancelSkip"
            (click)="close()"
          >
            {{ 'wallets.shared_wallets.skip_backup_modal.button_back' | translate }}
          </ion-button>
          <ion-button
            class="ux-link-xl main__actions__button"
            fill="clear"
            name="ux_create_skip_warning"
            appTrackClick
            [disabled]="!this.skipBackUpForm.valid"
            type="submit"
            (click)="this.handleSubmit()"
          >
            {{ 'wallets.shared_wallets.skip_backup_modal.button_skip' | translate }}
          </ion-button>
        </div>
      </form>
    </div>
  </div>`,
  styleUrls: ['./skip-backup-modal.component.scss'],
})
export class SkipBackupModalComponent implements OnInit {
  skipBackUpForm = this.formBuilder.group({ agreeSkipBackUp: [false, [Validators.requiredTrue]] });
  profileTestComplete: boolean;
  key = 'profileTestCompleted';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalController: ModalController,
    private navController: NavController,
    private ionicStorageService: IonicStorageService
  ) {}

  ngOnInit() {
    this.getProfileStatus();
  }

  handleSubmit() {
    if (this.skipBackUpForm.valid) {
      this.close();
      this.navigateToPage();
    }
  }

  navigateToPage() {
    return this.navController.navigateForward(['/tabs/wallets']);
  }

  getProfileStatus() {
    this.ionicStorageService.get(this.key).then((value: boolean) => (this.profileTestComplete = value));
  }

  close() {
    this.modalController.dismiss();
  }
}
