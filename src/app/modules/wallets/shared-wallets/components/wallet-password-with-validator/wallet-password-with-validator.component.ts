import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BiometricAuthInjectable } from '../../../../../shared/models/biometric-auth/injectable/biometric-auth-injectable';
import { VerifyResult } from '../../../../../shared/models/biometric-auth/verify-result.interface';
import { RemoteConfigService } from '../../../../../shared/services/remote-config/remote-config.service';
import { BiometricAuth } from '../../../../../shared/models/biometric-auth/biometric-auth.interface';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { LoginToken } from 'src/app/modules/users/shared-users/models/login-token/login-token';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { CONFIG } from 'src/app/config/app-constants.config';
import { ItemFormError } from 'src/app/shared/models/item-form-error';

@Component({
  selector: 'app-wallet-password-with-validator',
  template: `
  <!-- TODO: Styles are messed up -->
    <div class="wp">
      <div class="wp__header">
        <ion-text class="ux-font-text-lg wp__header__text" color="neutral90">
          {{ 'wallets.shared_wallets.wallet_password.title' | translate }}
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
          {{ 'wallets.shared_wallets.wallet_password.disclaimer' | translate }}
        </ion-text>
      </div>
      <form class="wp__form" [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
        <div class="wp__form__input">
          <!-- TODO: Border red when error -->
          <app-ux-input
            [label]="'wallets.shared_wallets.wallet_password.input_label' | translate"
            type="password"
            [textClass]="'primary'"
            [errors]="this.passwordErrors"
            controlName="password"
          ></app-ux-input>
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
            >{{ 'wallets.shared_wallets.wallet_password.submit_button_text' | translate }}</ion-button
          >
          <ion-button
            class="wp__form__buttons__use-biometric-button ux-link-xl"
            name="Use Biometric Data Password Modal"
            fill="clear"
            size="small"
            (click)="this.openBiometric()"
            *ngIf="this.isBiometricEnabled"
          >
            {{ 'wallets.shared_wallets.wallet_password.biometric_auth_button' | translate }}</ion-button
          >
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./wallet-password-with-validator.component.scss'],
})
export class WalletPasswordWithValidatorComponent implements OnInit {
  @Input() state: string;
  form: UntypedFormGroup = this.formBuilder.group({
    password: ['', [Validators.required]],
  });
  passwordErrors: ItemFormError[] = CONFIG.fieldErrors.oldPassword;

  trackClickEventName: string;
  biometricAuth: BiometricAuth;
  isBiometricEnabled  = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalController: ModalController,
    private translate: TranslateService,
    private biometricAuthInjectable: BiometricAuthInjectable,
    private remoteConfig: RemoteConfigService,
    private toastService: ToastService,
    private storage: IonicStorageService
  ) {}

  async ngOnInit() {
    this._setTrackClickEventName();
    this._setBiometricAuth();
    this._setIsBiometricAuthEnabled();
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

  private async _setIsBiometricAuthEnabled(): Promise<void> {
    this.isBiometricEnabled = this._biometricAuthFeatureEnabled() && (await this.biometricAuth.enabled());
  }

  private _biometricAuthFeatureEnabled(): boolean {
    return this.remoteConfig.getFeatureFlag('ff_bioauth');
  }

  async openBiometric(): Promise<void> {
    if (this.isBiometricEnabled) {
      const verifyResult: VerifyResult = await this.biometricAuth.verified();
      if (verifyResult.verified) {
        const password = new Password(await this.biometricAuth.password());
        await this._success(password);
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
    if (await this._isValidPassword()) {
      const password = new Password(this.form.value.password);
      this._success(password);
    } else {
      this.form.get('password').setErrors(CustomValidatorErrors.walletIncorrectPassword);
    }
  }

  private _success(password: Password): Promise<boolean> {
    return this.modalController.dismiss(password);
  }

  close(): Promise<boolean> {
    return this.modalController.dismiss();
  }

  private _isValidPassword(): Promise<boolean> {
    return new LoginToken(new Password(this.form.value.password), this.storage).valid();
  }
}
