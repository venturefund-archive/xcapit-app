import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordFormComponent } from '../shared-usuarios/components/reset-password-form/reset-password-form.component';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/users/login"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'usuarios.reset_password.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding-top ion-margin-top ion-padding-bottom ion-padding">
      <app-reset-password-form [isReset]="this.isReset" (send)="this.handleSubmit($event)">
        <div class="submit-button">
          <div class="ion-padding-top">
            <ion-button
              *ngIf="!this.isReset"
              appTrackClickUnauth
              name="Reset Password Email"
              expand="block"
              size="large"
              type="submit"
              color="uxsecondary"
              class="ux_button"
            >
              {{ 'usuarios.reset_password.reset_button' | translate }}
            </ion-button>

            <ion-button
              *ngIf="this.isReset"
              appTrackClickUnauth
              name="Reset Password Confirm"
              expand="block"
              size="large"
              type="submit"
              color="uxsecondary"
              class="ux_button"
            >
              {{ 'usuarios.reset_password.send_email_button' | translate }}
            </ion-button>
          </div>
        </div>
      </app-reset-password-form>
    </ion-content>
  `,
  styleUrls: ['./reset-password.page.scss']
})
export class ResetPasswordPage implements OnInit {
  @ViewChild(ResetPasswordFormComponent, { static: true })
  formComponent: ResetPasswordFormComponent;

  isReset: boolean;

  token: string;

  uidb64: string;

  constructor(
    public submitButtonService: SubmitButtonService,
    private activatedRoute: ActivatedRoute,
    private apiUsuarios: ApiUsuariosService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.getParams();
    this.setIsReset();
  }

  getParams() {
    this.token = this.activatedRoute.snapshot.paramMap.get(
      'resetPasswordToken'
    );
    this.uidb64 = this.activatedRoute.snapshot.paramMap.get('uidb64');
  }

  setIsReset() {
    this.isReset = !!(this.token && this.uidb64);
  }

  handleSubmit(data: any) {
    const result$ = this.isReset
      ? this.apiUsuarios.resetPassword({
          token: this.token,
          uidb64: this.uidb64,
          ...data
        })
      : this.apiUsuarios.sendResetPasswordEmail(data);
    result$.subscribe(() => this.success());
  }

  async success() {
    this.navController.navigateForward(['/users/success-reset', this.isReset], { replaceUrl: true });
  }
}
