import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-skip-backup-modal',
  template: `
  <div>
    <div class="main__body">
    <ion-label class="ux-font-text-lg">{{'wallets.shared_wallets.skip-backup-modal.title' |translate}}  </ion-label>
    <form [formGroup]="skipBackUpForm" class="main__body__form">
      <ion-item class="last ux-font-text-base ion-no-padding" lines="none">
            <ion-label color="neutral90" class="ion-no-margin">
            {{'wallets.shared_wallets.skip-backup-modal.description' |translate}}
            </ion-label>
            <ion-checkbox
              mode="md"
              name="skipBackUp"
              formControlName="agreeSkipBackUp"
              slot="start"
              (ionChange)="this.enableButton()"
            ></ion-checkbox>
      </ion-item>
    </form>
    </div>
    <div class="main__actions">
      <ion-button 
      class="ux-link-xl main__actions__button main__actions__button-back" 
      fill="clear"
      (click)="close()"
      >
      {{'wallets.shared_wallets.skip-backup-modal.button_back' |translate}}
      </ion-button>
      <ion-button 
      class="ux-link-xl main__actions__button" 
      fill="clear" 
      name= "ux_create_skip_warning" 
      appTrackClick 
      [disabled]="!acceptSkip"
      (click)=" goToHomeWallet()">
        {{'wallets.shared_wallets.skip-backup-modal.button_skip' |translate}}
      </ion-button>
    </div>
  </div>`,
  styleUrls: ['./skip-backup-modal.component.scss'],
})
export class SkipBackupModalComponent implements OnInit {
  acceptSkip = false;
  skipBackUpForm = this.fb.group({ agreeSkipBackUp: [false, [Validators.requiredTrue]] })
  constructor(private fb: FormBuilder, private modalController: ModalController, 
    private navController: NavController
    ) { }

  ngOnInit() { }

  enableButton() {
    return (this.acceptSkip = !this.acceptSkip);
  }

  close(state: string = 'canceled') {
      this.modalController.dismiss(null, state);
  }

  goToHomeWallet() {
    this.close();
    this.navController.navigateForward(['/tabs/wallets']);
  }

}
