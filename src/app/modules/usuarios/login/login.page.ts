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
          <svg
            class="google-auth__button__icon"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0)">
              <path
                d="M5.26599 10.4193C5.73387 9.00374 6.63685 7.77211 7.84611 6.90009C9.05536 6.02808 10.5091 5.56023 12 5.5633C13.69 5.5633 15.218 6.1633 16.418 7.1453L19.91 3.6543C17.782 1.7993 15.055 0.654297 12 0.654297C7.26999 0.654297 3.19799 3.3523 1.23999 7.3043L5.26599 10.4193Z"
                fill="#EA4335"
              />
              <path
                d="M16.0401 18.6672C14.9501 19.3702 13.5661 19.7452 12.0001 19.7452C10.5151 19.7483 9.06686 19.2842 7.8603 18.4186C6.65373 17.553 5.75 16.3298 5.27706 14.9222L1.23706 17.9892C2.22831 19.9955 3.76233 21.6836 5.66488 22.8618C7.56744 24.04 9.76227 24.6609 12.0001 24.6542C14.9331 24.6542 17.7351 23.6112 19.8341 21.6542L16.0411 18.6672H16.0401Z"
                fill="#34A853"
              />
              <path
                d="M19.834 21.6543C22.029 19.6063 23.454 16.5583 23.454 12.6543C23.454 11.9443 23.345 11.1813 23.182 10.4723H12V15.1093H18.436C18.119 16.6683 17.266 17.8753 16.041 18.6673L19.834 21.6543Z"
                fill="#4A90E2"
              />
              <path
                d="M5.27699 14.9223C5.03235 14.1912 4.90806 13.4253 4.90899 12.6543C4.90899 11.8723 5.03399 11.1213 5.26599 10.4193L1.23999 7.30432C0.416372 8.96701 -0.00820201 10.7988 -5.61577e-06 12.6543C-5.61577e-06 14.5743 0.444994 16.3843 1.23699 17.9893L5.27699 14.9223Z"
                fill="#FBBC05"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect
                  width="24"
                  height="24"
                  fill="white"
                  transform="translate(0 0.654297)"
                />
              </clipPath>
            </defs>
          </svg>
          {{ 'usuarios.login.google_auth' | translate }}
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

    this.apiUsuarios
      .loginWithGoogle(googleUser.authentication.idToken)
      .subscribe(() => this.success());
  }

  loginUser(data: any) {
    this.apiUsuarios.login(data).subscribe(() => this.success());
  }

  async success() {
    console.log('Success');
    this.loadingService.enabled();
    this.loginForm.form.reset();
    const storedLink = await this.subscriptionsService.checkStoredLink();
    if (!storedLink) {
      this.apiUsuarios
        .status(false)
        .subscribe((res) => this.redirectByStatus(res));
    }
  }

  getUrlByStatus(statusName) {
    let url: string[];
    switch (statusName) {
      case UserStatus.COMPLETE: {
        url = ['tabs/funds'];
        break;
      }
      case UserStatus.EXPLORER: {
        url = ['tabs/funds'];
        break;
      }
      case UserStatus.CREATOR: {
        url = ['tabs/funds'];
        break;
      }
      case UserStatus.FROM_BOT: {
        url = ['tutorials/first-steps'];
        break;
      }
      case UserStatus.BEGINNER: {
        url = ['tutorials/first-steps'];
        break;
      }
      default: {
        url = ['tabs/funds'];
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
