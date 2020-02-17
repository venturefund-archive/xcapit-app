import { Component, OnInit } from '@angular/core';
import { StorageApikeysService } from '../shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';

@Component({
  selector: 'app-insert-secret',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profiles/success"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'apikeys.insert_secret.header' | translate
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
          <div class="ik__title">
            <app-ux-title>{{
              'apikeys.insert_secret.title' | translate
            }}</app-ux-title>
          </div>
          <div class="ik__text_before">
            <app-ux-text>
              {{ 'apikeys.insert_secret.text_before' | translate }}
            </app-ux-text>
          </div>
          <div class="ik__ak_input">
            <app-ux-input
              controlName="secret_key"
              type="text"
              inputmode="text"
              [label]="'apikeys.insert_secret.insert_secret' | translate"
              [placeholder]="
                'apikeys.insert_secret.insert_secret_placeholder' | translate
              "
            ></app-ux-input>
          </div>
          <div class="ik__alert">
            <app-ux-alert-message type="info">
              {{ 'apikeys.insert_secret.text_help' | translate }}
            </app-ux-alert-message>
          </div>
        </div>
        <div class="ux_footer">
          <div class="ik__submit_button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Save API Keys"
              type="submit"
              color="uxsecondary"
              size="large"
              [disabled]="
                !this.form.valid ||
                (this.submitButtonService.isDisabled | async)
              "
            >
              {{ 'apikeys.insert_secret.submit_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./insert-secret.page.scss']
})
export class InsertSecretPage implements OnInit {
  apiKeyData: any;

  form: FormGroup = this.formBuilder.group({
    secret_key: ['', [Validators.required]]
  });

  constructor(
    private storageApikeysService: StorageApikeysService,
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private apiApikeys: ApiApikeysService
  ) {}

  ngOnInit() {
    this.storageApikeysService.data.subscribe(data => (this.apiKeyData = data));
  }

  handleSubmit() {
    if (this.form.valid) {
      this.apiApikeys.crud
        .create({ ...this.form.value, ...this.apiKeyData })
        .subscribe(
          () => this.success(),
          () => this.error()
        );
    }
  }

  success() {
    this.navController.navigateForward(['/apikeys/success']).then(() => {
      this.form.reset();
      this.storageApikeysService.clear();
    });
  }

  error() {
    this.navController.navigateBack(['/apikeys/insert-key']);
  }
}
