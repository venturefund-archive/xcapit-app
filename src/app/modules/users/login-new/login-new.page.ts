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
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';

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
  biometricAuth = this.biometricAuthInjectable.create();
  constructor(
    private toastService: ToastService,
    private notificationsService: NotificationsService,
    private formBuilder: UntypedFormBuilder,
    private storage: IonicStorageService,
    private navController: NavController,
    private translate: TranslateService,
    private modalController: ModalController,
    private biometricAuthInjectable: BiometricAuthInjectable,
    private trackService: TrackService,
    private ionicStorageService: IonicStorageService,
  ) {}

  ionViewWillEnter() {
    this.activateBiometricAuth();
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_screenview_login',
    });
  }

  dismissToast() {
    this.toastService.dismiss();
  }

  async activateBiometricAuth() {
    if ((await this.biometricAuth.enabled()) && (await this.biometricAuth.verified())) {
      this.handleSubmit(true);
    }
  }

  async enabledPushNotifications(): Promise<boolean> {
    return await this.ionicStorageService.get(this._aKey).then((status) => status);
  }

  returnedService(){
    return this.notificationsService.getInstance();
  }

  async initializeNotifications(){
    this.returnedService().init();
    if(await this.enabledPushNotifications()){
      this.returnedService().subscribeTo(this._aTopic);
    }else{
      this.returnedService().subscribeTo(this._aTopic);
      this.returnedService().unsubscribeFrom(this._aTopic);
    }
  }

  async handleSubmit(isBiometricAuth: boolean) {
    const password = isBiometricAuth
      ? await this.biometricAuth.password()
      : this.form.value.password;
    if (await new LoginToken(new Password(password), this.storage).valid()) {
      await new LoggedIn(this.storage).save(true);
      this.initializeNotifications();
      this.navController.navigateForward('/tabs/wallets', { replaceUrl: true });
    } else {
      this.toastService.showErrorToast({
        message: this.translate.instant('users.login_new.invalid_password_text'),
        duration: 8000,
      });
    }
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

  goToResetPassword(): void {
    this.navController.navigateForward('/users/recovery-info');
  }

  goToHelp(): void {
    this.navController.navigateForward('/support/options');
  }
}
