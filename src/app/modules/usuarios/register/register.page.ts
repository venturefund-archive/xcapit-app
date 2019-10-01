import { Component, OnInit, ViewChild } from '@angular/core';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { AuthFormComponent } from '../shared-usuarios/components/auth-form/auth-form.component';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  template: `
    <ion-toolbar>
      <ion-buttons slot="end">
        <app-language-button></app-language-button>
      </ion-buttons>
    </ion-toolbar>
    <ion-content class="ion-padding">
      <div class="main">
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
                  {{ 'usuarios.register.card_header' | translate }}
                </ion-card-header>
                <ion-card-content>
                  <app-auth-form (send)="this.registerUser($event)">
                    <div class="auth-button ion-padding-top ion-margin-top">
                      <ion-button
                        expand="full"
                        size="large"
                        type="submit"
                        appTrackClickUnauth
                        name="Register"
                        [disabled]="
                          !this.registerForm.form.valid ||
                          (this.submitButtonService.isDisabled | async)
                        "
                      >
                        <ion-icon
                          slot="start"
                          name="checkmark-circle-outline"
                        ></ion-icon>
                        {{ 'usuarios.register.submit_button' | translate }}
                      </ion-button>
                    </div>
                    <div class="auth-link ion-text-right ion-padding-top">
                      <ion-button
                        fill="clear"
                        size="small"
                        type="button"
                        appTrackClickUnauth
                        name="Go To Login"
                        [routerLink]="['/users/login']"
                      >
                        Login
                      </ion-button>
                    </div>
                  </app-auth-form>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  `,
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  @ViewChild(AuthFormComponent) registerForm: AuthFormComponent;

  constructor(
    public submitButtonService: SubmitButtonService,
    private apiUsuarios: ApiUsuariosService,
    private alertController: AlertController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  registerUser(data: any) {
    this.apiUsuarios.crud.create(data).subscribe(() => this.success());
  }

  async success() {
    this.registerForm.form.reset();
    const alert = await this.alertController.create({
      message: `
        <h4>
          ${this.translate.instant('usuarios.register.success_text')}
        </h4>`,
      buttons: [this.translate.instant('usuarios.register.accept_button')]
    });
    await alert.present();
  }
}
