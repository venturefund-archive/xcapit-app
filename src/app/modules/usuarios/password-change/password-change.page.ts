import { Component, ViewChild } from '@angular/core';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { PasswordChangeFormComponent } from '../shared-usuarios/components/password-change-form/password-change-form.component';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../shared-usuarios/services/auth/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-password-change',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/list"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'usuarios.password_change.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <app-password-change-form (send)="this.handleSubmit($event)">
        <div class="submit-button">
          <div class="auth-button ion-padding-top ion-margin-top">
            <ion-button
              appTrackClick
              name="Change Password"
              expand="full"
              size="large"
              type="submit"
              color="success"
              [disabled]="
                !this.formComponent.form.valid ||
                (this.submitButtonService.isDisabled | async)
              "
            >
              <ion-icon slot="start" name="checkmark-circle-outline"></ion-icon>
              {{ 'usuarios.password_change.submit_button' | translate }}
            </ion-button>
          </div>
        </div>
      </app-password-change-form>
    </ion-content>
  `,
  styleUrls: ['./password-change.page.scss']
})
export class PasswordChangePage {
  @ViewChild(PasswordChangeFormComponent)
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
    console.log({ data });
    this.apiUsuarios.changePassword(data).subscribe(() => this.success());
  }

  async success() {
    await this.auth.logout();
    await this.navController
      .navigateBack(['/users/login'], { replaceUrl: true })
      .then(() => {
        this.formComponent.form.reset();
        this.toast.showToast({
          header: this.translate.instant(
            'usuarios.password_change.toast_password_change_header'
          ),
          message: this.translate.instant(
            'usuarios.password_change.toast_password_change_message'
          )
        });
      });
  }
}
