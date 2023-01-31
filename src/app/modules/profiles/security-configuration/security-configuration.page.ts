import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppExpirationTimeService } from 'src/app/shared/models/app-session/injectable/app-expiration-time.service';
import { BiometricAuthInjectable } from 'src/app/shared/models/biometric-auth/injectable/biometric-auth-injectable';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { Password } from '../../swaps/shared-swaps/models/password/password';
import { PasswordErrorMsgs } from '../../swaps/shared-swaps/models/password/password-error-msgs';
import { LoginToken } from '../../users/shared-users/models/login-token/login-token';
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
        <ion-item lines="none" class="sco__inactivity ux-font-title-xs ion-no-padding">
          <div class="sco__inactivity__labels">
            <ion-text class=" ux-font-text-lg">
              {{ 'profiles.security_configuration.inactivity.title' | translate }}
            </ion-text>
            <ion-text class="ux-font-text-base">
              {{ 'profiles.security_configuration.inactivity.message' | translate }}
            </ion-text>
            <div class="sco__inactivity__radio-group">
              <ion-radio-group formControlName="inactivity">
                <div class="container">
                  <ion-item class="ux-font-text-base">
                    <ion-label>{{ 'profiles.security_configuration.inactivity.option_1' | translate }}</ion-label>
                    <ion-radio name="never" mode="md" slot="start" value="999999"></ion-radio>
                  </ion-item>
                </div>
                <div class="container">
                  <ion-item class="ux-font-text-base">
                    <ion-label>{{ 'profiles.security_configuration.inactivity.option_2' | translate }}</ion-label>
                    <ion-radio name="always" mode="md" slot="start" value="0.1"></ion-radio>
                  </ion-item>
                </div>
                <div class="container">
                  <ion-item class="ux-font-text-base">
                    <ion-label>{{ 'profiles.security_configuration.inactivity.option_3' | translate }}</ion-label>
                    <ion-radio name="2minutes" mode="md" slot="start" value="2"></ion-radio>
                  </ion-item>
                </div>
                <div class="container">
                  <ion-item class="ux-font-text-base">
                    <ion-label>{{ 'profiles.security_configuration.inactivity.option_4' | translate }}</ion-label>
                    <ion-radio name="5minutes" mode="md" slot="start" value="5"></ion-radio>
                  </ion-item>
                </div>
              </ion-radio-group>
            </div>
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
  inactivityValueChangesSubscription$: Subscription;
  biometricValueChangesSubscription$: Subscription;
  form: UntypedFormGroup = this.formBuilder.group({
    biometric: [false, []],
    inactivity: ['', []],
  });
  previousInactivity: string;
  constructor(
    private modalController: ModalController,
    private translate: TranslateService,
    private navController: NavController,
    private remoteConfig: RemoteConfigService,
    private biometricAuthInjectable: BiometricAuthInjectable,
    private formBuilder: UntypedFormBuilder,
    private toastService: ToastService,
    private loginBiometricActivationService: LoginBiometricActivationModalService,
    private appExpirationTimeService: AppExpirationTimeService,
    private storage: IonicStorageService
  ) {}

  async ionViewDidEnter() {
    await this.getExpirationSessionTime();
    await this.setBiometricAuth();
    this.biometricAuthAvailable();
    this.valueChanges();
  }

  ionViewDidLeave() {
    this.biometricValueChangesSubscription$.unsubscribe();
    this.inactivityValueChangesSubscription$.unsubscribe();
  }

  private async setBiometricAuth() {
    this.form.patchValue({ biometric: await this.biometricAuthInjectable.create().enabled() });
  }

  private valueChanges() {
    this.biometricValueChangesSubscription$ = this.form.get('biometric').valueChanges.subscribe((value) => {
      this.toggle(value);
    });
    this.inactivityValueChangesSubscription$ = this.form.get('inactivity').valueChanges.subscribe((value) => {
      this.selectSessionExpirationTime(value);
    });
  }

  async selectSessionExpirationTime(mode) {
    const password = await this.requestPassword('profiles.biometric_auth.alternative_password_description');
    try {
      if (await this.checkPassword(password)) {
        this.appExpirationTimeService.set(parseFloat(mode));
      } else {
        this.showErrorToast();
        this.form.patchValue({ inactivity: this.previousInactivity }, { emitEvent: false });
      }
    } catch (err) {
      if (new PasswordErrorMsgs().isEmptyError(err)) {
        this.form.patchValue({ inactivity: this.previousInactivity }, { emitEvent: false });
      }
    } finally {
      this.previousInactivity = this.form.value.inactivity;
    }
  }

  private async requestPassword(description: string) {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      componentProps: {
        state: 'biometric',
        title: this.translate.instant('profiles.biometric_auth.password_title'),
        description: this.translate.instant(description),
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
      return this.requestPassword('profiles.biometric_auth.password_description');
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

  async getExpirationSessionTime(): Promise<void> {
    const expirationTime = await this.appExpirationTimeService.get();
    if (expirationTime) {
      console.log('expirationTimeService value found, patching form with value: ', expirationTime)
      this.form.patchValue({ inactivity: this._expirationValue(expirationTime) }, { emitEvent: false });
    } else {
      console.log('expirationTimeService value NOT found')
    }
    this.previousInactivity = this.form.value.inactivity;
    console.log('post-asignation expiration value: ', this.form.value.inactivity)
  }

  private _expirationValue(storageValue: number) {
    return storageValue.toString();
  }

  public checkPassword(password: Password): Promise<boolean> {
    return new LoginToken(password, this.storage).valid();
  }
}
