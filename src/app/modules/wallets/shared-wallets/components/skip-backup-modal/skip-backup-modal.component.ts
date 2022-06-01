import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-skip-backup-modal',
  template: ` <div class="main__body">
    <form [formGroup]="skipBackUpForm" class="main__body__form">
      <div class="main__body__form__content">
        <ion-label class="ux-font-text-lg"
          >{{ 'wallets.shared_wallets.skip-backup-modal.title' | translate }}
        </ion-label>
        <ion-item class="last ux-font-text-base ion-no-padding" lines="none">
          <ion-label color="neutral90" class="ion-no-margin">
            {{ 'wallets.shared_wallets.skip-backup-modal.description' | translate }}
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
          {{ 'wallets.shared_wallets.skip-backup-modal.button_back' | translate }}
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
          {{ 'wallets.shared_wallets.skip-backup-modal.button_skip' | translate }}
        </ion-button>
      </div>
    </form>
  </div>`,
  styleUrls: ['./skip-backup-modal.component.scss'],
})
export class SkipBackupModalComponent implements OnInit {
  skipBackUpForm = this.fb.group({ agreeSkipBackUp: [false, [Validators.requiredTrue]] });
  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private navController: NavController
  ) {}

  ngOnInit() {}

  handleSubmit() {
    if (this.skipBackUpForm.valid) {
      this.close();
      this.navController.navigateForward(['/tabs/wallets']);
    }
  }

  close() {
    this.modalController.dismiss();
  }
}
