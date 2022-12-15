import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BiometricAuthInjectable } from 'src/app/shared/models/biometric-auth/injectable/biometric-auth-injectable';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { Password } from '../../swaps/shared-swaps/models/password/password';
import { PasswordErrorMsgs } from '../../swaps/shared-swaps/models/password/password-error-msgs';
import { LoginBiometricActivationModalService } from '../../users/shared-users/services/login-biometric-activation-modal-service/login-biometric-activation-modal.service';
import { WalletPasswordComponent } from '../../wallets/shared-wallets/components/wallet-password/wallet-password.component';

@Component({
  selector: 'app-security-configuration',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'profiles.security_configuration.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form [formGroup]="this.form">
        <ion-item lines="none" class="sco__toggle ux-font-title-xs ion-no-padding">
          <div class="sco__toggle__labels">
            <ion-text class="ux-font-text-lg">
              {{ 'profiles.biometric_auth.toggle_text' | translate }}
            </ion-text>
            <ion-text class="ux-font-text-base">{{
              'profiles.biometric_auth.toggle_description' | translate
            }}</ion-text>
          </div>
          <ion-toggle
            formControlName="biometric"
            name="ux_create_all"
            class="sco__toggle__toggle ux-toggle ion-no-padding"
            mode="ios"
            slot="end"
          ></ion-toggle>
        </ion-item>
        <ion-item lines="none" class="sco__inactivity ux-font-title-xs ion-no-padding">
          <div class="sco__inactivity__labels">
            <ion-text class=" ux-font-text-lg">
              {{ 'profiles.security_configuration.inactivity.title' | translate }}
            </ion-text>
            <ion-text class="ux-font-text-base">
              {{ 'profiles.security_configuration.inactivity.message' | translate }}
            </ion-text>
          </div>
        </ion-item>
        <ion-item lines="none" class="sco__password-change ux-font-title-xs ion-no-padding">
          <div class="sco__password-change__labels">
            <ion-text class=" ux-font-text-lg">
              {{ 'profiles.security_configuration.password_change.title' | translate }}
            </ion-text>
            <ion-text class="ux-link-xl">
              {{ 'profiles.security_configuration.password_change.message' | translate }}
            </ion-text>
          </div>
        </ion-item>
      </form>
    </ion-content>
  `,
  styleUrls: ['./security-configuration.page.scss'],
})
export class SecurityConfigurationPage implements OnInit {
  form: UntypedFormGroup = this.formBuilder.group({
    biometric: [false, []],
  });
  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalController: ModalController,
    private translate: TranslateService,
    private biometricAuthInjectable: BiometricAuthInjectable,
    private loginBiometricActivationService: LoginBiometricActivationModalService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    await this.setBiometricAuth();
    this.valueChanges();
  }

  private async setBiometricAuth() {
    this.form.patchValue({ biometric: await this.biometricAuthInjectable.create().enabled() });
  }

  private valueChanges() {
    this.form.valueChanges.subscribe((value) => this.toggle(value.biometric));
  }

  private async requestPassword() {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      componentProps: {
        state: 'biometric',
        title: this.translate.instant('profiles.biometric_auth.password_title'),
        description: this.translate.instant('profiles.biometric_auth.password_description'),
        submitButtonText: this.translate.instant('profiles.biometric_auth.password_button'),
        disclaimer: '',
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    return new Password(data);
  }

  async toggle(value: boolean) {
    const biometricAuth = this.biometricAuthInjectable.create();
    biometricAuth.onNeedPass().subscribe(() => this.requestPassword());
    if (value) {
      await biometricAuth.on().catch((err) => {
        if (!new PasswordErrorMsgs().isEmptyError(err)) {
          this.showErrorToast();
        }
        this.disableToggle();
      });
    } else {
      await this.loginBiometricActivationService.enableModal();
      await biometricAuth.off();
    }
  }

  private disableToggle() {
    this.form.patchValue({ biometric: false }, { emitEvent: false });
  }

  private showErrorToast() {
    this.toastService.showErrorToast({
      message: this.translate.instant('profiles.biometric_auth.password_error'),
    });
  }
}
