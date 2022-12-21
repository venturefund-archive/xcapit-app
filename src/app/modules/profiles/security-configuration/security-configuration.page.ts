import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BiometricAuthInjectable } from 'src/app/shared/models/biometric-auth/injectable/biometric-auth-injectable';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
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
        <ion-item lines="none" class="sco__toggle ux-font-title-xs ion-no-padding" *ngIf="this.isBioAuthEnabled">
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
        <ion-item lines="none" class="sco__inactivity ux-font-title-xs ion-no-padding" *ngIf="this.isInactivityEnabled">
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
            <ion-text class="ux-font-text-lg">
              {{ 'profiles.security_configuration.password_change.title' | translate }}
            </ion-text>
            <ion-button
              class="ux-link-xl ion-no-margin"
              fill="clear"
              (click)="this.goToChangePassword()"
              name="ux_go_to_wallet_change_password"
              appTrackClick
            >
              {{ 'profiles.security_configuration.password_change.button' | translate }}
            </ion-button>
          </div>
        </ion-item>
      </form>
    </ion-content>
  `,
  styleUrls: ['./security-configuration.page.scss'],
})
export class SecurityConfigurationPage {
  isBioAuthEnabled = false;
  isInactivityEnabled = false;
  valueChangesSubscription$: Subscription;
  form: UntypedFormGroup = this.formBuilder.group({
    biometric: [false, []],
  });
  constructor(
    private modalController: ModalController,
    private translate: TranslateService,
    private navController: NavController,
    private remoteConfig: RemoteConfigService,
    private biometricAuthInjectable: BiometricAuthInjectable,
    private formBuilder: UntypedFormBuilder,
    private toastService: ToastService,
    private loginBiometricActivationService: LoginBiometricActivationModalService,
  ) {}

  async ionViewDidEnter() {
    await this.setBiometricAuth();
    this.biometricAuthAvailable();
    this.valueChanges();
  }

  ionViewDidLeave() {
    this.valueChangesSubscription$.unsubscribe()
  }
  
  private async setBiometricAuth() {
    this.form.patchValue({ biometric: await this.biometricAuthInjectable.create().enabled() });
  }

  private valueChanges() {
    this.valueChangesSubscription$ = this.form.valueChanges.subscribe((value) =>  {
      this.toggle(value.biometric)
    });
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
    biometricAuth.onNeedPass().subscribe(() => {
      return this.requestPassword()
    });
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

  goToChangePassword() {
    this.navController.navigateForward(['/wallets/password-change']);
  }

  async biometricAuthAvailable() {
    if (await this.biometricAuthInjectable.create().available()) {
      this.isBioAuthEnabled = this.remoteConfig.getFeatureFlag('ff_bioauth');
    }
  }
}
