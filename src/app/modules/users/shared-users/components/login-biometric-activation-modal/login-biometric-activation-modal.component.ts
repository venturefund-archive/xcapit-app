import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LoginBiometricActivationModalService } from '../../services/login-biometric-activation-modal-service/login-biometric-activation-modal.service';

@Component({
  selector: 'app-login-biometric-activation-modal',
  template: `
  <div class="modal-content">
    <div class="lbam">
      <div class="ion-padding lbam__content">
        <div class="lbam__content__title">
          <ion-text class="ux-font-text-lg">{{
            'users.login_biometric_activation_modal.title' | translate
          }}</ion-text>
        </div>
        <div class="lbam__content__text">
          <ion-text class="ux-font-text-base">{{
            'users.login_biometric_activation_modal.text' | translate
          }}</ion-text>
        </div>
        <form [formGroup]="this.form">
          <div class="lbam__content__checkbox">
            <ion-item class="ion-no-padding ion-no-margin" lines="none">
              <ion-checkbox formControlName="dontShowModalCheckbox" mode="md" slot="start"></ion-checkbox>
              <ion-label class="ux-font-text-base">{{
                'users.login_biometric_activation_modal.checkbox_label' | translate
              }}</ion-label>
            </ion-item>
          </div>
        </form>
      </div>
      <div class="lbam__buttons">
        <div class="lbam__buttons__close-button">
          <ion-button appTrackClick (click)="this.cancel()" name="Cancel" class="ux_button" fill="clear">{{
            'users.login_biometric_activation_modal.cancel_button' | translate
          }}</ion-button>
        </div>
        <div class="lbam__buttons__confirm-button">
          <ion-button appTrackClick (click)="this.confirm()" name="Confirm" class="ux_button" fill="clear">{{
            'users.login_biometric_activation_modal.confirm_button' | translate
          }}</ion-button>
        </div>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./login-biometric-activation-modal.component.scss'],
})
export class LoginBiometricActivationModalComponent {
  form: UntypedFormGroup = this.formBuilder.group({
    dontShowModalCheckbox: [false, []],
  });
  constructor(
    private formBuilder: UntypedFormBuilder,
    private loginBiometricActivationService: LoginBiometricActivationModalService,
    private modalController: ModalController,

  ) { }

  async confirm() {
    await this.saveModalChoice();
    this.modalController.dismiss('confirm');
  }

  async cancel() {
    await this.saveModalChoice();
    this.modalController.dismiss('cancel');
  }

  async saveModalChoice() {
    if (this.form.value.dontShowModalCheckbox) await this.loginBiometricActivationService.disableModal();
  }
}
