import { Component } from '@angular/core';
import { ItemFormError } from '../../../shared/models/item-form-error';
import { CONFIG } from '../../../config/app-constants.config';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { CustomValidatorErrors } from '../../../shared/validators/custom-validator-errors';
import { LoginToken } from '../shared-users/models/login-token/login-token';
import { IonicStorageService } from '../../../shared/services/ionic-storage/ionic-storage.service';
import { Password } from '../../swaps/shared-swaps/models/password/password';
import { LoggedIn } from '../shared-users/models/logged-in/logged-in';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-new',
  template: `
    <ion-content class="ion-padding">
      <div class="xcapit-logo">
        <app-xcapit-logo [whiteLogo]="true"></app-xcapit-logo>
      </div>
      <div class="ul__title">
        <ion-text class="ux-font-text-xl">{{ 'users.login_new.title' | translate }}</ion-text>
        <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
          <div class="ul__input">
            <app-ux-input
              controlName="password"
              type="password"
              inputmode="password"
              [label]="'users.login_new.password_label' | translate"
              aria-label="password"
              tabindex="1"
              (click)="this.dismissToast()"
              [infoIcon]="true"
              (infoIconClicked)="this.showPasswordInfoModal()"
            ></app-ux-input>
          </div>
          <div class="ul__login-button">
            <ion-button
              expand="block"
              size="large"
              type="submit"
              class="main__login_button ux_button"
              color="secondary"
              [disabled]="this.form.value.password.length === 0"
            >
              {{ 'users.login_new.login_button_text' | translate }}
            </ion-button>
          </div>
          <div class="ul__reset-password-button">
            <ion-button
              class="ux-link-xs"
              fill="clear"
              size="small"
              type="button"
              color="info"
              (click)="this.goToResetPassword()"
            >
              {{ 'users.login_new.reset_password_link' | translate }}
            </ion-button>
          </div>
        </form>
      </div>
    </ion-content>
    <ion-footer>
      <div class="ul__footer__help-button">
        <ion-button class="ux-link-xs underline" name="Access Faq" (click)="this.goToHelp()" fill="clear" size="small">
          <ion-icon slot="start" name="ux-lifeguard"></ion-icon>
          {{ 'users.login_new.help_link' | translate }}</ion-button
        >
      </div>
    </ion-footer>
  `,
  styleUrls: ['./login-new.page.scss'],
})
export class LoginNewPage {
  form: UntypedFormGroup = this.formBuilder.group({
    password: ['', []],
  });
  constructor(
    private toastService: ToastService,
    private formBuilder: UntypedFormBuilder,
    private storage: IonicStorageService,
    private navController: NavController,
    private translate: TranslateService
  ) {}

  dismissToast() {
    this.toastService.dismiss();
  }

  async handleSubmit() {
    if (await new LoginToken(new Password(this.form.value.password), this.storage).valid()) {
      await new LoggedIn(this.storage).save(true);
      this.navController.navigateForward('/tabs/wallets', { replaceUrl: true });
    } else {
      this.toastService.showErrorToast({
        message: this.translate.instant('users.login_new.invalid_password_text'),
        duration: 8000,
      });
    }
  }

  showPasswordInfoModal(): void {
    console.warn('Show password info modal not implemented yet');
  }

  goToResetPassword(): void {
    console.warn('Go to reset password not implemented yet');
  }

  goToHelp(): void {
    this.navController.navigateForward('/support/options')
  }
}
