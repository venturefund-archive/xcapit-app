import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthFormComponent } from '../shared-usuarios/components/auth-form/auth-form.component';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="app_header_trama">
      <app-ux-header-login>
        <div class="app_header_trama__content">
          <div class="app_header_trama__content__app_language_button">
            <app-language-button></app-language-button>
          </div>
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
            [disabled]="(this.submitButtonService.isDisabled | async)"
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
    </div>
  `,
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  @ViewChild(AuthFormComponent, { static: true }) loginForm: AuthFormComponent;

  constructor(
    public submitButtonService: SubmitButtonService,
    private apiUsuarios: ApiUsuariosService,
    private subscriptionsService: SubscriptionsService
  ) {}

  ngOnInit() {}

  loginUser(data: any) {
      this.apiUsuarios.login(data).subscribe(() => this.success());
  }

  success() {
    this.loginForm.form.reset();
    this.subscriptionsService.checkStoredLink();
  }
}
