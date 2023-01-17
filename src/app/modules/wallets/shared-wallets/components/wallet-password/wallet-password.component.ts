import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BiometricAuthInjectable } from '../../../../../shared/models/biometric-auth/injectable/biometric-auth-injectable';
import { VerifyResult } from '../../../../../shared/models/biometric-auth/verify-result.interface';
import { RemoteConfigService } from '../../../../../shared/services/remote-config/remote-config.service';
import { BiometricAuth } from '../../../../../shared/models/biometric-auth/biometric-auth.interface';
import { ToastService } from '../../../../../shared/services/toast/toast.service';

@Component({
  selector: 'app-wallet-password',
  template: `
    <div class="wp">
      <div class="wp__header">
        <ion-text class="ux-font-text-lg wp__header__text" color="neutral90">
          {{ this.title }}
        </ion-text>
        <ion-button
          appTrackClick
          name="Close"
          class="wp__header__close_button"
          size="small"
          fill="clear"
          (click)="this.close()"
        >
          <ion-icon name="close-outline"></ion-icon>
        </ion-button>
      </div>
      <div class="wp__description">
        <ion-text class="ux-font-text-base">
          {{ this.description }}
        </ion-text>
      </div>
      <form class="wp__form" [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
        <div class="wp__form__input">
          <app-ux-input
            [label]="this.inputLabel"
            type="password"
            [textClass]="'primary'"
            controlName="password"
          ></app-ux-input>
        </div>
        <div class="wp__form__disclaimer">
          <ion-text class="ux-font-text-xsg">
            {{ this.disclaimer }}
          </ion-text>
        </div>
        <div class="wp__form__buttons">
          <ion-button
            class="ux_button"
            color="secondary"
            appTrackClick
            [dataToTrack]="{ eventLabel: this.trackClickEventName }"
            name="Confirm Password"
            type="submit"
            [disabled]="!this.form.valid"
            >{{ this.submitButtonText }}</ion-button
          >
          <ion-button
            class="wp__form__buttons__use-biometric-button ux-link-xl"
            name="Use Biometric Data Password Modal"
            fill="clear"
            size="small"
            (click)="this.openBiometric()"
            *ngIf="this.biometricEnabled"
          >
            {{ this.biometricAuthButton }}</ion-button
          >
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./wallet-password.component.scss'],
})
export class WalletPasswordComponent implements OnInit {
  @Input() state: string;
  form: UntypedFormGroup = this.formBuilder.group({
    password: ['', [Validators.required]],
  });

  title = this.translate.instant('wallets.shared_wallets.wallet_password.title');
  disclaimer = this.translate.instant('wallets.shared_wallets.wallet_password.disclaimer');
  submitButtonText = this.translate.instant('wallets.shared_wallets.wallet_password.submit_button_text');
  inputLabel = this.translate.instant('wallets.shared_wallets.wallet_password.input_label');
  biometricAuthButton = this.translate.instant('wallets.shared_wallets.wallet_password.biometric_auth_button');
  description = '';

  biometricEnabled = false;
  trackClickEventName: string;
  biometricAuth: BiometricAuth;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalController: ModalController,
    private translate: TranslateService,
    private biometricAuthInjectable: BiometricAuthInjectable,
    private remoteConfig: RemoteConfigService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    this._setTrackClickEventName();
    this._setBiometricAuth();
    await this._setBiometricAuthEnabled();
    await this.openBiometric();
  }

  private _setTrackClickEventName(): void {
    if (this.state) {
      this.trackClickEventName = `ux_${this.state}_confirm_password`;
    } else {
      this.trackClickEventName = 'Confirm Password';
    }
  }

  private _setBiometricAuth(): void {
    this.biometricAuth = this.biometricAuthInjectable.create();
  }

  private async _setBiometricAuthEnabled(): Promise<void> {
    this.biometricEnabled = this._biometricAuthFeatureEnabled() && (await this.biometricAuth.enabled());
  }

  private _biometricAuthFeatureEnabled(): boolean {
    return this.remoteConfig.getFeatureFlag('ff_bioauth');
  }

  async openBiometric(): Promise<void> {
    if (this._biometricAuthFeatureEnabled() && this.biometricEnabled) {
      const verifyResult: VerifyResult = await this.biometricAuth.verified();
      if (verifyResult.verified) {
        this.form.patchValue({ password: await this.biometricAuth.password() });
        await this.handleSubmit();
      }
      if (verifyResult.message === 'Authentication failed.') {
        await this._showErrorToast();
      }
    }
  }

  private async _showErrorToast(): Promise<void> {
    await this.toastService.showInfoToast({
      message: this.translate.instant('users.login_new.error_biometric_auth'),
      duration: 5000,
    });
  }

  async handleSubmit() {
    if (this.form.valid) await this.modalController.dismiss(this.form.value.password);
  }

  close() {
    this.modalController.dismiss();
  }
}
