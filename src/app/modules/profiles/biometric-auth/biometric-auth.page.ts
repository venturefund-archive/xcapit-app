import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WalletPasswordComponent } from '../../wallets/shared-wallets/components/wallet-password/wallet-password.component';
import { Password } from '../../swaps/shared-swaps/models/password/password';
import { TranslateService } from '@ngx-translate/core';
import { BiometricAuthInjectable } from '../../../shared/models/biometric-auth/injectable/biometric-auth-injectable';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { PasswordErrorMsgs } from '../../swaps/shared-swaps/models/password/password-error-msgs';
import { LoginBiometricActivationModalService } from '../../users/shared-users/services/login-biometric-activation-modal-service/login-biometric-activation-modal.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-biometric-auth',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'profiles.biometric_auth.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form [formGroup]="this.form">
        <ion-item lines="none" class="ba__toggle ux-font-title-xs ion-no-padding">
          <div class="ba__toggle__labels">
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
            class="ba__toggle__toggle ux-toggle ion-no-padding"
            mode="ios"
            slot="end"
          ></ion-toggle>
        </ion-item>
      </form>
    </ion-content>
  `,
  styleUrls: ['./biometric-auth.page.scss'],
})
export class BiometricAuthPage {
  form: UntypedFormGroup = this.formBuilder.group({
    biometric: [false, []],
  });
  leave$ = new Subject<void>();
  constructor(
    private modalController: ModalController,
    private translate: TranslateService,
    private biometricAuthInjectable: BiometricAuthInjectable,
    private formBuilder: UntypedFormBuilder,
    private toastService: ToastService,
    private loginBiometricActivationService: LoginBiometricActivationModalService,
    private trackService: TrackService
  ) {}

  async ionViewDidEnter() {
    await this.setBiometricAuth();
    this.valueChanges();
  }

  private async setBiometricAuth() {
    this.form.patchValue({ biometric: await this.biometricAuthInjectable.create().enabled() });
  }

  private valueChanges() {
    this.form.valueChanges.pipe(takeUntil(this.leave$)).subscribe((value) => {
      this.toggle(value.biometric);
      this.sendEvent(value.biometric);
    });
  }

  sendEvent(value: boolean) {
    this.trackService.trackEvent({
      eventLabel: `ux_biometric_auth_${value ? 'on' : 'off'}`,
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
    this.form.patchValue({ biometric: false }, {emitEvent: false});
  }

  private showErrorToast() {
    this.toastService.showErrorToast({
      message: this.translate.instant('profiles.biometric_auth.password_error'),
    });
  }

  ionViewWillLeave() {
    this.leave$.next();
    this.leave$.complete();
  }
}
