import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { SimplifiedWallet } from '../../models/simplified-wallet/simplified-wallet';

@Component({
  selector: 'app-change-profile-type-modal',
  template: `
    <div class="modal-content">
      <div class="main__body">
        <div class="main__body__content">
          <ion-label class="ux-font-text-lg"
            >{{ 'wallets.shared_wallets.profile_type_modal.title' | translate }}
          </ion-label>
          <ion-label
            color="neutral90"
            class="ion-no-margin ux-font-text-base"
            [innerHTML]="'wallets.shared_wallets.profile_type_modal.description' | translate"
          >
          </ion-label>
        </div>
        <div class="main__actions">
          <ion-button
            class="ux-link-xl main__actions__button main__actions__button-back"
            appTrackClick
            fill="clear"
            name="ux_toast_send_go_back"
            (click)="this.close()"
          >
            {{ 'wallets.shared_wallets.profile_type_modal.button_back' | translate }}
          </ion-button>
          <ion-button
            class="ux-link-xl main__actions__button"
            fill="clear"
            name="ux_toast_send_switch"
            appTrackClick
            type="submit"
            (click)="this.handleSubmit()"
          >
            {{ 'wallets.shared_wallets.profile_type_modal.button_change' | translate }}
          </ion-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./change-profile-type-modal.component.scss'],
})
export class ChangeProfileTypeModalComponent implements OnInit {
  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private ionicStorageService: IonicStorageService
  ) {}

  ngOnInit(): void {}

  handleSubmit() {
    this.close();
    this.navigateToPage();
  }

  navigateToPage() {
    new SimplifiedWallet(this.ionicStorageService).save(false);
    return this.navController.navigateRoot('/tabs/wallets');
  }

  close() {
    this.modalController.dismiss();
  }
}
