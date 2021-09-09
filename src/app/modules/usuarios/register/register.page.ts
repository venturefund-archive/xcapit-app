import { Component, OnInit, ViewChild } from '@angular/core';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { AuthFormComponent } from '../shared-usuarios/components/auth-form/auth-form.component';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;
@Component({
  selector: 'app-register',
  template: `
    <ion-header>
      <div>
        <div class="app_header_register">
          <div class="app_header_register__content">
            <div class="app_header_register__content__app_xcapit_logo">
              <app-xcapit-logo [whiteLogo]="false"></app-xcapit-logo>
            </div>
          </div>
        </div>
        <div class="register_title">
          <app-ux-title>
            {{ 'usuarios.register.card_header' | translate }}
          </app-ux-title>
        </div>
      </div>
    </ion-header>

    <ion-content class="ion-padding-horizontal ion-padding-bottom">
      <div class="main">
        <app-auth-form (send)="this.registerUser($event)">
          <div class="tos-text">
            <div class="ux-font-text-xs tos-text__label">
              {{ 'usuarios.register.accept_tos' | translate }}

              <ion-button
                fill="clear"
                size="small"
                type="button"
                appTrackClickUnauth
                name="Open TOS"
                class="ux-font-text-xs tos-text__button ux_button"
                routerDirection="back"
                (click)="openTOS()"
              >
                {{ 'usuarios.register.link_tos' | translate }}
              </ion-button>
            </div>
          </div>

          <div class="auth-button ion-padding-top">
            <ion-button
              expand="block"
              size="large"
              type="submit"
              appTrackClickUnauth
              name="Register"
              class="ux_button"
              color="uxsecondary"
              [disabled]="!this.registerForm.form.valid || (this.submitButtonService.isDisabled | async)"
            >
              {{ 'usuarios.register.submit_button' | translate }}
            </ion-button>
          </div>
          <div class="ux-font-text-xs auth-link ion-text-right ion-padding-top">
            {{ 'usuarios.register.have_an_account' | translate }}
            <ion-button
              fill="clear"
              size="small"
              type="button"
              appTrackClickUnauth
              name="Go To Login"
              class="main__back_login__button ux_button"
              [routerLink]="['/users/login']"
              routerDirection="back"
            >
              {{ 'usuarios.register.back_login' | translate }}
            </ion-button>
          </div>
        </app-auth-form>
      </div>
    </ion-content>
  `,
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild(AuthFormComponent, { static: true })
  registerForm: AuthFormComponent;

  referralCode: string;
  manualReferral = true;

  constructor(
    public submitButtonService: SubmitButtonService,
    private apiUsuarios: ApiUsuariosService,
    private alertController: AlertController,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private navController: NavController
  ) {
    Browser.prefetch({
      urls: ['https://www.info.xcapit.com/terms'],
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.setReferralCode();
    this.setEmail();
  }

  setReferralCode() {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.registerForm.form.patchValue({
        manual_referral: true,
        referral_code: code,
      });
    }
  }

  setEmail() {
    const email = this.getEmailFromUrl();
    if (email) {
      ['email'].forEach((fieldName) => {
        const formField = this.registerForm.form.get(fieldName);
        formField.setValue(email);
        formField.markAsTouched();
      });
    }
  }

  getEmailFromUrl(): string {
    let decodeEmail: string;
    const email = this.route.snapshot.paramMap.get('email');
    if (email) {
      try {
        decodeEmail = atob(email);
      } catch (error) {
        decodeEmail = '';
      }
    }
    return decodeEmail;
  }

  registerUser(data: any) {
    if (data && !data.manual_referral) {
      delete data.referral_code;
    }
    this.apiUsuarios.crud.create(data).subscribe((response) => this.success(response));
  }

  async success(response) {
    // tslint:disable-next-line:no-non-null-assertion
    if (!Object.keys(response).length!) {
      this.showWhiteListAlert();
    } else {
      this.registerForm.form.reset();
      const params = { replaceUrl: true, state: { email: response.email } };
      this.navController.navigateForward(['/users/success-register'], params);
    }
  }

  async showWhiteListAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('usuarios.register.waiting_list_alert.alert_header'),
      message: this.translate.instant('usuarios.register.waiting_list_alert.alert_message'),
      buttons: [
        {
          text: this.translate.instant('usuarios.register.waiting_list_alert.alert_cancel_button'),
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: this.translate.instant('usuarios.register.waiting_list_alert.alert_join_button'),
          handler: (_) => this.openWaitingList(),
        },
      ],
    });
    await alert.present();
  }

  async openTOS() {
    await Browser.open({
      toolbarColor: '#ff9100',
      url: 'https://www.info.xcapit.com/tutorial/xcapit_terms.html',
    });
  }

  async openWaitingList() {
    await Browser.open({
      toolbarColor: '#ff9100',
      url: 'https://www.xcapit.com/waiting-list',
    });
  }
}
