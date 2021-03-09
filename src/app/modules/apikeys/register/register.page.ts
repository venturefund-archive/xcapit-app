import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { ApikeysService } from '../shared-apikeys/services/apikeys/apikeys.service';

@Component({
  selector: 'app-register',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/apikeys/list"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'apikeys.register.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form
        [formGroup]="this.form"
        (ngSubmit)="this.handleSubmit()"
        class="ux_main"
      >
        <div class="ux_content">
          <div class="ik__ak_input">
            <app-ux-input
              controlName="alias"
              type="text"
              inputmode="text"
              [label]="'apikeys.register.label_alias' | translate"
              [placeholder]="'apikeys.register.placeholder_alias' | translate"
            ></app-ux-input>
            <app-ux-input
              controlName="apikey"
              type="text"
              inputmode="text"
              [label]="'apikeys.register.label_apikey' | translate"
              [placeholder]="'apikeys.register.placeholder_apikey' | translate"
            ></app-ux-input>
            <app-ux-input
              controlName="secretkey"
              type="text"
              inputmode="text"
              [label]="'apikeys.register.label_secretkey' | translate"
              [placeholder]="
                'apikeys.register.placeholder_secretkey' | translate
              "
            ></app-ux-input>
            <ion-button
              class="main__help__button ux_button"
              appTrackClickUnauth
              name="Need Help"
              fill="clear"
              size="small"
              type="button"
              color="uxsecondary"
              [routerLink]="['*']"
            >
              {{ 'apikeys.register.link_help' | translate }}
            </ion-button>
          </div>
        </div>
        <div class="ux_footer">
          <div class="ik__next_button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Next"
              type="submit"
              color="uxsecondary"
              size="large"
              [disabled]="this.submitButtonService.isDisabled | async"
            >
              {{ 'apikeys.register.button_submmit' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>`,
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    alias: [
      '',
      [
        Validators.required,
        Validators.maxLength(23),
        CustomValidators.patternValidator(
          /^[a-zA-Z0-9]+$/,
          CustomValidatorErrors.hasSpecialCharacter
        ),
      ],
    ],
    apikey: ['', [Validators.required]],
    secretkey: ['', [Validators.required]],
  });

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private apiKeysService: ApikeysService,
    private alertController: AlertController,
    private translate: TranslateService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  async showAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('apikeys.register.alert.title'),
      message: this.translate.instant('apikeys.register.alert.text'),
      buttons: [
        {
          text: this.translate.instant('apikeys.register.alert.button'),
          handler: (_) => this.submitData(),
        },
      ],
    });
    await alert.present();
  }

  handleSubmit() {
    if (this.form.valid) {
      this.showAlert();
    } else {
      this.form.markAllAsTouched();
    }
  }

  submitData() {
    const data = this.form.value;
    this.apiKeysService.updateData(data);
    this.navController.navigateForward(['/apikeys/success-register']);
  }
}
