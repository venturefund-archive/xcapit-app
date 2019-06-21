import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthFormComponent } from '../shared-usuarios/components/auth-form/auth-form.component';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-login',
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
                  Login
                </ion-card-header>
                <ion-card-content>
                  <app-auth-form
                    [isLogin]="true"
                    (send)="this.loginUser($event)"
                  >
                    <div class="auth-button ion-padding-top ion-margin-top">
                      <ion-button
                        expand="full"
                        size="large"
                        type="submit"
                        [disabled]="
                          !this.loginForm.form.valid ||
                          (this.submitButtonService.isDisabled | async)
                        "
                      >
                        <ion-icon slot="start" name="log-in"></ion-icon>
                        Login
                      </ion-button>
                    </div>
                    <div class="auth-link ion-text-right ion-padding-top">
                      <ion-button
                        fill="clear"
                        size="small"
                        type="button"
                        [routerLink]="['/users/register']"
                      >
                        {{ 'usuarios.login.register_link' | translate }}
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
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  @ViewChild(AuthFormComponent) loginForm: AuthFormComponent;

  constructor(
    public submitButtonService: SubmitButtonService,
    private apiUsuarios: ApiUsuariosService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  loginUser(data: any) {
    this.apiUsuarios.login(data).subscribe(() => this.success());
  }

  success() {
    this.loginForm.form.reset();
    this.navController.navigateForward(['/funds/list']);
  }
}
