import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordFormComponent } from '../shared-usuarios/components/reset-password-form/reset-password-form.component';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  template: `
    <ion-toolbar>
      <ion-buttons slot="end">
        <app-language-button></app-language-button>
      </ion-buttons>
    </ion-toolbar>

    <ion-content>
      <ion-grid class="ion-no-padding">
        <ion-row>
          <ion-col
            size-sm="8"
            offset-sm="2"
            size-md="6"
            offset-md="3"
            size-lg="4"
            offset-lg="4"
          >
            <ion-card>
              <ion-card-header>
                {{ 'usuarios.reset_password.card_header' | translate }}
              </ion-card-header>
              <ion-card-content>
                <app-reset-password-form
                  [isReset]="this.isReset"
                  (send)="this.handleSubmit($event)"
                >
                  <div class="submit-button">
                    <div class="auth-button ion-padding-top ion-margin-top">
                      <ion-button
                        *ngIf="this.isReset"
                        expand="full"
                        size="large"
                        type="submit"
                        [disabled]="
                          !this.formComponent.form.valid ||
                          (this.submitButtonService.isDisabled | async)
                        "
                      >
                        <ion-icon
                          slot="start"
                          name="checkmark-circle-outline"
                        ></ion-icon>
                        {{ 'usuarios.reset_password.reset_button' | translate }}
                      </ion-button>
                      <ion-button
                        *ngIf="!this.isReset"
                        expand="full"
                        size="large"
                        type="submit"
                        [disabled]="
                          !this.formComponent.form.valid ||
                          (this.submitButtonService.isDisabled | async)
                        "
                      >
                        <ion-icon slot="start" name="send"></ion-icon>
                        {{
                          'usuarios.reset_password.send_email_button'
                            | translate
                        }}
                      </ion-button>
                    </div>
                  </div>

                  <div class="other-links">
                    <div class="ion-text-left ion-padding-top">
                      <ion-button
                        fill="clear"
                        size="small"
                        type="button"
                        routerDirection="back"
                        [replaceUrl]="true"
                        [routerLink]="['/users/login']"
                      >
                        {{ 'usuarios.reset_password.login_link' | translate }}
                      </ion-button>
                    </div>
                  </div>
                </app-reset-password-form>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
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
    private navController: NavController,
    private toast: ToastService,
    private translate: TranslateService
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
    const header = this.isReset
      ? 'usuarios.reset_password.toast_reset_password_header'
      : 'usuarios.reset_password.toast_send_email_header';
    const message = this.isReset
      ? 'usuarios.reset_password.toast_reset_password_message'
      : 'usuarios.reset_password.toast_send_email_message';
    await this.navController
      .navigateBack(['/users/login'], { replaceUrl: true })
      .then(() => {
        this.formComponent.form.reset();
        this.toast.showToast({
          header: this.translate.instant(header),
          message: this.translate.instant(message)
        });
      });
  }
}
