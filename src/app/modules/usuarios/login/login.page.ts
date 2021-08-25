import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthFormComponent } from '../shared-usuarios/components/auth-form/auth-form.component';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { UserStatus } from '../shared-usuarios/enums/user-status.enum';
import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-login',
  template: `
    <div class="app_header_trama">
      <app-ux-header-login>
        <div class="app_header_trama__content">
          <div class="app_header_trama__content__app_xcapit_logo">
            <app-xcapit-logo></app-xcapit-logo>
          </div>
        </div>
      </app-ux-header-login>
    </div>
    <div class="login_title">
      <app-ux-title>
        {{ 'usuarios.login.title' | translate }}
      </app-ux-title>
    </div>

    <div class="main ion-padding-horizontal ion-padding-bottom">
      <app-auth-form [isLogin]="true" (send)="this.loginUser($event)">
        <div class="auth-link-reset-password main__reset_password">
          <ion-button
            class="main__reset_password__button ux_button"
            appTrackClickUnauth
            name="Reset Password"
            fill="clear"
            size="small"
            type="button"
            color="uxsecondary"
            [routerLink]="['/users/reset-password']"
          >
            {{ 'usuarios.login.reset_password_link' | translate }}
          </ion-button>
        </div>
        <div class="auth-button">
          <ion-button
            appTrackClickUnauth
            name="Login"
            expand="block"
            size="large"
            type="submit"
            class="main__login_button ux_button"
            color="uxsecondary"
            [disabled]="this.submitButtonService.isDisabled | async"
          >
            {{ 'usuarios.login.login_button_text' | translate }}
          </ion-button>
        </div>
        <div class="auth-link main__go_to_register ion-text-center">
          <ion-button
            appTrackClickUnauth
            name="Go To Register"
            fill="clear"
            size="large"
            expand="block"
            type="button"
            color="uxsecondary"
            [routerLink]="['/users/register']"
            class="ux_button"
          >
            {{ 'usuarios.login.register_link' | translate }}
          </ion-button>
        </div>
      </app-auth-form>
      <div class="ion-text-center">
        <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-14 or-text"
          >- {{ 'usuarios.login.or_text' | translate }} -</ion-text
        >
      </div>
      <div class="google-auth">
        <ion-button
          appTrackClickUnauth
          name="Google Auth"
          expand="block"
          fill="solid"
          size="large"
          type="button"
          class="ux_button google-auth__button"
          [disabled]="this.submitButtonService.isDisabled | async"
          (click)="this.googleSingUp()"
        >
          <img [src]="'../../../assets/img/usuarios/login/google-logo.svg'" alt="Google Logo" />
          <span class="google-auth__button__text ux-font-lato ux-fweight-regular ux-fsize-16">{{
            'usuarios.login.google_auth' | translate
          }}</span>
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(AuthFormComponent, { static: true }) loginForm: AuthFormComponent;
  googleAuthPlugin: any = Plugins.GoogleAuth;

  constructor(
    public submitButtonService: SubmitButtonService,
    private apiUsuarios: ApiUsuariosService,
    private subscriptionsService: SubscriptionsService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {}

  async googleSingUp() {
    let googleUser;

    try {
      googleUser = await this.googleAuthPlugin.signIn();
    } catch (e) {
      return;
    }

    this.apiUsuarios.loginWithGoogle(googleUser.authentication.idToken).subscribe(() => this.success());
  }

  loginUser(data: any) {
    this.apiUsuarios.login(data).subscribe(() => this.success());
  }

  async success() {
    this.loadingService.enabled();
    this.loginForm.form.reset();
    const storedLink = await this.subscriptionsService.checkStoredLink();
    if (!storedLink) {
      this.apiUsuarios.status(false).subscribe((res) => this.redirectByStatus(res));
    }
  }

  getUrlByStatus(statusName) {
    let url: string[];
    switch (statusName) {
      case UserStatus.COMPLETE: {
        url = ['tabs/home'];
        break;
      }
      case UserStatus.EXPLORER: {
        url = ['tabs/home'];
        break;
      }
      case UserStatus.CREATOR: {
        url = ['tabs/home'];
        break;
      }
      case UserStatus.BEGINNER: {
        url = ['tutorials/first-steps'];
        break;
      }
      default: {
        url = ['tabs/home'];
        break;
      }
    }
    return url;
  }

  redirectByStatus(userStatus) {
    const url = this.getUrlByStatus(userStatus.status_name);
    this.router.navigate(url).then(() => this.loadingService.disabled());
  }
}
