import { Component, ViewChild } from '@angular/core';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { PasswordChangeFormComponent } from '../shared-users/components/password-change-form/password-change-form.component';
import { ApiUsuariosService } from '../shared-users/services/api-usuarios/api-usuarios.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../shared-users/services/auth/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-password-change',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'users.password_change.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding-top ion-margin-top ion-padding-bottom">
      <app-password-change-form (send)="this.handleSubmit($event)">
        <div class="submit-button">
          <div class="ion-padding-top ion-margin-top ion-padding-horizontal ux_footer">
            <ion-button
              appTrackClick
              name="Change Password"
              expand="block"
              size="large"
              type="submit"
              color="secondary"
              class="ux_button"
              [disabled]="this.submitButtonService.isDisabled | async"
            >
              {{ 'users.password_change.submit_button' | translate }}
            </ion-button>
          </div>
        </div>
      </app-password-change-form>
    </ion-content>
  `,
  styleUrls: ['./password-change.page.scss'],
})
export class PasswordChangePage {
  @ViewChild(PasswordChangeFormComponent, { static: true })
  formComponent: PasswordChangeFormComponent;

  constructor(
    public submitButtonService: SubmitButtonService,
    private apiUsuarios: ApiUsuariosService,
    private toast: ToastService,
    private translate: TranslateService,
    private auth: AuthService,
    private navController: NavController
  ) {}

  handleSubmit(data: any) {
    this.apiUsuarios.changePassword(data).subscribe(() => this.success());
  }

  async success() {
    await this.auth.logout();
    await this.navController.navigateBack(['/users/login'], { replaceUrl: true }).then(() => {
      this.formComponent.form.reset();
      this.toast.showToast({
        header: this.translate.instant('users.password_change.toast_password_change_header'),
        message: this.translate.instant('users.password_change.toast_password_change_message'),
      });
    });
  }
}
