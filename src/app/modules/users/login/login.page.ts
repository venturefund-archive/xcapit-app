import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthFormComponent } from '../shared-users/components/auth-form/auth-form.component';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ApiUsuariosService } from '../shared-users/services/api-usuarios/api-usuarios.service';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { LocalNotificationsService } from '../../notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { UpdateNewsService } from 'src/app/shared/services/update-news/update-news.service';
import { PlatformService } from '../../../shared/services/platform/platform.service';
import { WalletConnectService } from '../../wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Component({
  selector: 'app-login',
  template: `
    <ion-header>
      <div class="xcapit-logo">
        <app-xcapit-logo [whiteLogo]="false"></app-xcapit-logo>
      </div>
    </ion-header>
    <div class="login-title">
      <app-ux-title>
        {{ 'users.login.title' | translate }}
      </app-ux-title>
    </div>

    <div class="main ion-padding-horizontal ion-padding-bottom">
      <app-auth-form [isLogin]="true" (send)="this.loginUser($event)">
        <div class="auth-button">
          <ion-button
            appTrackClick
            name="Login"
            expand="block"
            size="large"
            type="submit"
            class="main__login_button ux_button"
            color="secondary"
            [disabled]="this.submitButtonService.isDisabled | async"
            [appLoading]="this.loading"
            [loadingText]="'users.login.loading' | translate"
          >
            {{ 'users.login.login_button_text' | translate }}
          </ion-button>
        </div>
        <div class="auth-link main__go_to_register ion-text-center">
          <ion-button
            appTrackClick
            name="Go To Register"
            fill="clear"
            size="large"
            expand="block"
            type="button"
            (click)="this.goToRegister()"
            class="ux-link-xl"
          >
            {{ 'users.login.register_link' | translate }}
          </ion-button>
        </div>
      </app-auth-form>
      <!-- div class="ion-text-center">
        <ion-text class="ux-font-text-xs">- {{ 'usuarios.login.or_text' | translate }} -</ion-text>
      </div>

      <ion-button
        appTrackClick
        name="Google Auth"
        expand="block"
        fill="clear"
        size="large"
        type="button"
        class="ux_button google-auth color"
        [disabled]="this.submitButtonService.isDisabled | async"
        (click)="this.googleSingUp()"
      >
        <img slot="start" [src]="'../../../assets/img/usuarios/login/google-logo.svg'" alt="Google-Logo" />
        <span class="google-auth__button__text ux-font-worksans">{{ 'usuarios.login.google_auth' | translate }}</span>
      </ion-button -->
      <div class="auth-link-reset-password main__reset_password">
        <ion-button
          class="main__reset_password__button ux-link-xs"
          appTrackClick
          name="Reset Password"
          fill="clear"
          size="small"
          type="button"
          color="info"
          (click)="this.goToResetPassword()"
        >
          {{ 'users.login.reset_password_link' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(AuthFormComponent, { static: true }) loginForm: AuthFormComponent;
  googleAuthPlugin = GoogleAuth;
  alreadyOnboarded: boolean;
  loading: boolean;

  constructor(
    public submitButtonService: SubmitButtonService,
    private apiUsuarios: ApiUsuariosService,
    private subscriptionsService: SubscriptionsService,
    private notificationsService: NotificationsService,
    private localNotificationsService: LocalNotificationsService,
    private navController: NavController,
    private storage: Storage,
    private updateNewsService: UpdateNewsService,
    private platformService: PlatformService,
    private walletConnectService: WalletConnectService,
    private ionicStorageService: IonicStorageService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getFinishedOnboard();
    this.initGoogleAuth();
  }

  private getFinishedOnboard() {
    this.storage.get('FINISHED_ONBOARDING').then((res) => (this.alreadyOnboarded = res));
  }

  private initGoogleAuth() {
    if (this.platformService.isWeb()) this.googleAuthPlugin.init();
  }

  async googleSingUp() {
    let googleUser;

    try {
      googleUser = await this.googleAuthPlugin.signIn();
    } catch (e) {
      return;
    }

    this.apiUsuarios.loginWithGoogle(googleUser.authentication.idToken).subscribe(() => this.success());
  }

  async checkWalletProtected() {
    this.ionicStorageService.get('protectedWallet').then((protectedWallet) => {
      if (!protectedWallet) {
        // PW != undefined -> si es True no entra al if else setea el warning
        // PW == undefined -> JS lo castea a boolean, y undefined o null son false
        this.ionicStorageService.set('backupWarningWallet', true);
      }
    });  
  }

  loginUser(data: any) {
    this.loading = true;
    this.apiUsuarios.login(data).subscribe(
      () => this.success(),
      () => (this.loading = false)
    );
  }

  private async success() {
    this.loginForm.form.reset();
    this.notificationsService.getInstance().init();
    this.localNotificationsService.init();
    const storedLink = await this.subscriptionsService.checkStoredLink();
    if (!storedLink) {
      if (this.walletConnectService.uri && this.alreadyOnboarded) {
        await this.walletConnectService.checkDeeplinkUrl();
      } else {
        await this.navigateTo(this.startUrl());
      }
    }
    await this.checkWalletProtected()
    this.loading = false;
    await this.updateNewsService.showModal();
  }

  async navigateTo(urlPath: string[]) {
    return this.navController.navigateForward(urlPath);
  }

  startUrl() {
    return this.alreadyOnboarded ? ['tabs/home'] : ['tutorials/first-steps'];
  }

  async goToResetPassword() {
    await this.navController.navigateForward(['/users/reset-password']);
  }

  async goToRegister() {
    await this.navController.navigateForward(['/users/register']);
  }
}
