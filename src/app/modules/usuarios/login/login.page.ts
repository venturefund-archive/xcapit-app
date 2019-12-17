import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthFormComponent } from '../shared-usuarios/components/auth-form/auth-form.component';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="app_header_trama">
      <app-header-trama>
        <div class="app_header_trama__content">
          <div class="app_header_trama__content__app_language_button">
            <app-language-button></app-language-button>
          </div>
          <div class="app_header_trama__content__app_xcapit_logo">
            <app-xcapit-logo></app-xcapit-logo>
          </div>
        </div>
      </app-header-trama>
    </div>
    <ion-content class="ion-padding">
      <div class="main">

          <ion-grid class="ion-no-padding">
            <ion-row>
              <ion-col
                size-xs="10"
                offset-xs="1"
                size-sm="8"
                offset-sm="2"
                size-md="6"
                offset-md="3"
                size-lg="4"
                offset-lg="4"
              >
                <app-auth-form [isLogin]="true" (send)="this.loginUser($event)">
                  <div class="auth-button ion-padding-top ion-margin-top">
                    <ion-button
                      appTrackClickUnauth
                      name="Login"
                      expand="block"
                      size="large"
                      type="submit"
                      class="main__login_button"
                      color="xcprimary"
                      [disabled]="
                        !this.loginForm.form.valid ||
                        (this.submitButtonService.isDisabled | async)
                      "
                    >
                      {{ 'usuarios.login.login_button_text' | translate }}
                    </ion-button>
                  </div>
                  <div class="auth-link ion-text-center ion-padding-top">
                    <ion-button
                      appTrackClickUnauth
                      name="Go To Register"
                      fill="clear"
                      size="small"
                      type="button"
                      color="xcprimary"
                      [routerLink]="['/users/register']"
                    >
                      {{ 'usuarios.login.register_link' | translate }}
                    </ion-button>
                    <ion-button
                      appTrackClickUnauth
                      name="Reset Password"
                      fill="clear"
                      size="small"
                      type="button"
                      color="xcprimary"
                      [routerLink]="['/users/reset-password']"
                    >
                      {{ 'usuarios.login.reset_password_link' | translate }}
                    </ion-button>
                  </div>
                </app-auth-form>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
    </ion-content>
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
