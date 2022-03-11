import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/modules/usuarios/shared-usuarios/services/auth/auth.service';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { LogOutModalService } from '../../services/log-out-modal/log-out-modal.service';

@Component({
  selector: 'app-log-out-modal',
  template: `
    <div class="lom">
      <div class="ion-padding lom__content">
        <div class="lom__content__title">
          <ion-text class="ux-font-text-lg">{{
            'profiles.user_profile_menu.log_out_modal.title' | translate
          }}</ion-text>
        </div>
        <div class="lom__content__text">
          <ion-text class="ux-font-text-base">{{
            'profiles.user_profile_menu.log_out_modal.text' | translate
          }}</ion-text>
        </div>
        <div class="lom__content__more-info">
          <ion-text class="ux-font-text-base">{{
            'profiles.user_profile_menu.log_out_modal.more_info' | translate
          }}</ion-text
          ><br />
          <ion-button
            appTrackClick
            (click)="this.goToWalletFaq()"
            name="Wallet FAQs"
            class="ux-link-xs ion-no-padding ion-no-margin"
            fill="clear"
          >
            {{ 'profiles.user_profile_menu.log_out_modal.more_info_link' | translate }}
          </ion-button>
        </div>
        <form [formGroup]="this.form">
          <div class="lom__content__checkbox">
            <ion-item class="ion-no-padding ion-no-margin" lines="none">
              <ion-checkbox formControlName="dontShowModalCheckbox" mode="md" slot="start"></ion-checkbox>
              <ion-label class="ux-font-text-base">{{
                'profiles.user_profile_menu.log_out_modal.checkbox_label' | translate
              }}</ion-label>
            </ion-item>
          </div>
        </form>
      </div>
      <div class="lom__close-button">
        <ion-button appTrackClick (click)="this.logout()" name="Log Out" class="ux_button" fill="clear">{{
          'profiles.user_profile_menu.log_out_modal.log_out_button' | translate
        }}</ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./log-out-modal.component.scss'],
})
export class LogOutModalComponent implements OnInit {
  @Input() username: string;
  form: FormGroup = this.formBuilder.group({
    dontShowModalCheckbox: [false, []],
  });

  constructor(
    private authService: AuthService,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private logOutModalService: LogOutModalService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  async logout() {
    if (this.form.value.dontShowModalCheckbox) {
      await this.saveModalChoice();
    }

    await this.authService.logout();
    await this.navController.navigateRoot(['/users/login']);
    await this.modalController.dismiss();
  }

  async goToWalletFaq() {
    await this.navController.navigateForward(['/support/wallet']);
  }

  async saveModalChoice() {
    await this.logOutModalService.addUserToNotShowModal(this.username);
  }
}
