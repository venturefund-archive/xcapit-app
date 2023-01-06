import { Component } from '@angular/core';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { LoginToken } from '../shared-users/models/login-token/login-token';
import { IonicStorageService } from '../../../shared/services/ionic-storage/ionic-storage.service';
import { Password } from '../../swaps/shared-swaps/models/password/password';
import { LoggedIn } from '../shared-users/models/logged-in/logged-in';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoginPasswordInfoComponent } from '../shared-users/components/login-password-info/login-password-info.component';
import { BiometricAuthInjectable } from 'src/app/shared/models/biometric-auth/injectable/biometric-auth-injectable';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { VerifyResult } from 'src/app/shared/models/biometric-auth/verify-result.interface';
import { BiometricAuth } from 'src/app/shared/models/biometric-auth/biometric-auth.interface';
import { WalletBackupService } from '../../wallets/shared-wallets/services/wallet-backup/wallet-backup.service';
import { LoginBiometricActivationModalComponent } from '../shared-users/components/login-biometric-activation-modal/login-biometric-activation-modal.component';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { LoginBiometricActivationModalService } from '../shared-users/services/login-biometric-activation-modal-service/login-biometric-activation-modal.service';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { LoginMigrationService } from '../shared-users/services/login-migration-service/login-migration-service';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { AuthService } from '../shared-users/services/auth/auth.service';
import { WalletConnectService } from '../../wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { AppSessionInjectable } from 'src/app/shared/models/app-session/injectable/app-session.injectable';

@Component({
  selector: 'app-login-new',
  template: `
    <ion-content class="ion-padding">
      <div class="xcapit-logo">
        <app-xcapit-logo [whiteLogo]="true"></app-xcapit-logo>
      </div>
      <div class="ul__title">
        <ion-text class="ux-font-text-xl">{{ 'users.login_new.title' | translate }}</ion-text>
        <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit(false)">
          <div class="ul__input">
            <app-ux-input
              controlName="password"
              type="password"
              inputmode="password"
              [label]="'users.login_new.password_label' | translate"
              aria-label="password"
              tabindex="1"
              (click)="this.dismissToast()"
              [textClass]="'info'"
              [infoIcon]="true"
              (infoIconClicked)="this.showPasswordInfoModal()"
              [labelColor]="'white'"
            ></app-ux-input>
          </div>
          <div class="ul__login-button">
            <ion-button
              expand="block"
              size="large"
              type="submit"
              class="main__login_button ux_button"
              color="secondary"
              [disabled]="this.form.value.password.length === 0"
            >
              {{ 'users.login_new.login_button_text' | translate }}
            </ion-button>
          </div>
          <div class="ul__reset-password-button">
            <ion-button
              appTrackClick
              name="ux_recover_password"
              class="ux-link-xs"
              fill="clear"
              size="small"
              type="button"
              color="info"
              (click)="this.goToResetPassword()"
            >
              {{ 'users.login_new.reset_password_link' | translate }}
            </ion-button>
          </div>
          <div class="ul__use-biometric-button" *ngIf="this.biometricEnabled">
            <ion-button class="ux-link-xl" (click)="this.activateBiometricAuth()" fill="clear" size="small">
              {{ 'users.login_new.use_biometric' | translate }}</ion-button
            >
          </div>
        </form>
      </div>
    </ion-content>
    <ion-footer>
      <div class="ul__footer__help-button">
        <ion-button
          class="ux-link-xs underline"
          name="ux_login_help"
          appTrackClick
          (click)="this.goToHelp()"
          fill="clear"
          size="small"
        >
          <ion-icon slot="start" name="ux-lifeguard"></ion-icon>
          {{ 'users.login_new.help_link' | translate }}</ion-button
        >
      </div>
    </ion-footer>
  `,
  styleUrls: ['./login-new.page.scss'],
})
export class LoginNewPage {
  form: UntypedFormGroup = this.formBuilder.group({
    password: ['', []],
  });
  private readonly _aTopic = 'app';
  private readonly _aKey = 'enabledPushNotifications';
  biometricAuth: BiometricAuth;
  showToast = true;
  isModalOpen = false;
  biometricEnabled: boolean;

  constructor(
    private toastService: ToastService,
    private formBuilder: UntypedFormBuilder,
    private storage: IonicStorageService,
    private navController: NavController,
    private translate: TranslateService,
    private modalController: ModalController,
    private biometricAuthInjectable: BiometricAuthInjectable,
    private trackService: TrackService,
    private ionicStorageService: IonicStorageService,
    private walletBackupService: WalletBackupService,
    private platformService: PlatformService,
    private loginBiometricActivationService: LoginBiometricActivationModalService,
    private remoteConfig: RemoteConfigService,
    private loginMigrationService: LoginMigrationService,
    private notificationsService: NotificationsService,
    private authService: AuthService,
    private walletConnectService: WalletConnectService,
    private appSession: AppSessionInjectable
  ) {}

  async ionViewWillEnter() {
    this.removeOldToken();
    this._setBiometricAuth();
    await this._setBiometricEnabled();
    await this.activateBiometricAuth();
    this._trackScreenView();
    this.subscribeOnValueChanges();
    this.enablePushNotificationsByDefault();
  }

  private _trackScreenView(): void {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_screenview_login',
    });
  }

  private _setBiometricAuth() {
    this.biometricAuth = this.biometricAuthInjectable.create();
  }

  async enablePushNotificationsByDefault() {
    if ((await this.enabledPushNotifications()) === null) {
      await this.ionicStorageService.set(this._aKey, true);
    }
  }

  subscribeOnValueChanges() {
    this.form.valueChanges.subscribe(() => {
      this.showToast = true;
    });
  }

  private removeOldToken(): void {
    this.authService.logout();
  }

  dismissToast() {
    this.toastService.dismiss();
  }

  private async _setBiometricEnabled() {
    this.biometricEnabled = await this.biometricAuth.enabled();
  }

  private _biometricAuthFeatureEnabled(): boolean {
    return this.remoteConfig.getFeatureFlag('ff_bioauth');
  }

  async activateBiometricAuth() {
    if (this._biometricAuthFeatureEnabled() && this.biometricEnabled) {
      const verifyResult: VerifyResult = await this.biometricAuth.verified();
      if (verifyResult.verified) {
        this.handleSubmit(true);
      }
      if (verifyResult.message === 'Authentication failed.') {
        this.toastService.showInfoToast({
          message: this.translate.instant('users.login_new.error_biometric_auth'),
          duration: 5000,
        });
        this.biometricAuth.off();
      }
    }
  }

  async enabledPushNotifications(): Promise<boolean> {
    return await this.ionicStorageService.get(this._aKey).then((status) => status);
  }

  pushNotificationsService() {
    return this.notificationsService.getInstance();
  }

  async initializeNotifications() {
    this.pushNotificationsService().init();
    if (await this.enabledPushNotifications()) {
      this.pushNotificationsService().subscribeTo(this._aTopic);
    } else {
      this.pushNotificationsService().subscribeTo(this._aTopic);
      this.pushNotificationsService().unsubscribeFrom(this._aTopic);
    }
  }

  private _loginToken(aPassword: string): LoginToken {
    return new LoginToken(new Password(aPassword), this.storage);
  }

  private async _loggedIn(): Promise<void> {
    await new LoggedIn(this.storage).save(true);
    await this.initializeNotifications();
    await this._checkWalletConnectDeepLink();
    await this.checkWalletProtected();
    this.appSession.create().save();
  }

  private async _checkWalletConnectDeepLink() {
    if (this.walletConnectService.uri.value) {
      await this.walletConnectService.checkDeeplinkUrl();
    }
  }

  async handleSubmit(isBiometricAuth: boolean) {
    const password = isBiometricAuth ? await this.biometricAuth.password() : this.form.value.password;
    if (!(await this._loginToken(password).exist())) {
      try {
        await this.loginMigrationService.migrate(password);
        await this._loggedIn();
        this._goToWallet();
      } catch {
        this._showInvalidPasswordToast();
      }
    } else if (await this._loginToken(password).valid()) {
      await this._loggedIn();
      if (this._biometricAuthFeatureEnabled() && this.platformService.isNative()) {
        if (!(await this.biometricAuth.enabled()) && this.form.value.password && this.biometricAuth.available()) {
          if ((await this.showLoginBiometricActivation()) === 'confirm') {
            this.biometricAuth.onNeedPass().subscribe(() => Promise.resolve(new Password(this.form.value.password)));
            await this.biometricAuth.on();
          }
        }
      }
      this._goToWallet();
    } else {
      this._showInvalidPasswordToast();
    }
  }

  private _goToWallet(): void {
    this.navController.navigateForward('/tabs/wallets', { replaceUrl: true });
  }

  private _showInvalidPasswordToast() {
    if (this.showToast) {
      this.toastService.showErrorToast({
        message: this.translate.instant('users.login_new.invalid_password_text'),
        duration: 8000,
      });
    }
    this.showToast = false;
  }

  async checkWalletProtected() {
    this.storage.get('protectedWallet').then((protectedWallet) => {
      if (!protectedWallet) {
        this.walletBackupService.enableModal();
      }
    });
  }

  async showPasswordInfoModal() {
    const modal = await this.modalController.create({
      component: LoginPasswordInfoComponent,
      showBackdrop: false,
      cssClass: 'ux-modal-password-info',
      componentProps: {
        title: 'users.login_password_info.title',
        subtitle: 'users.login_password_info.subtitle',
        image: 'assets/img/users/login_password_info/info.svg',
        button: 'users.login_password_info.button',
      },
    });
    modal.present();
  }

  async showLoginBiometricActivation() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      if (await this.loginBiometricActivationService.isShowModal()) {
        const modal = await this.modalController.create({
          component: LoginBiometricActivationModalComponent,
          showBackdrop: true,
          backdropDismiss: false,
          cssClass: 'modal',
        });
        modal.present();
        const { data } = await modal.onWillDismiss();
        this.isModalOpen = false;
        return data;
      }
    }
  }

  goToResetPassword(): void {
    this.navController.navigateForward('/users/recovery-info');
  }

  goToHelp(): void {
    this.navController.navigateForward('/support/options');
  }
}
