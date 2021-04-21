import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';

@Component({
  selector: 'app-new-api-keys',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-title class="ion-text-center">{{
          'apikeys.create_apikey.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form
        [formGroup]="this.form"
        (ngSubmit)="this.submitData()"
        class="ux_main"
      >
        <div class="ux_content">
          <app-ux-title class="ion-padding-top ion-margin-top">
            <div class="ion-margin-top">
              {{ 'apikeys.create_apikey.title' | translate }}
            </div>
          </app-ux-title>
          <div class="ik__ak_input">
            <app-ux-input
              controlName="api_key"
              type="text"
              inputmode="text"
              [label]="'apikeys.create_apikey.label_apikey' | translate"
              [placeholder]="
                'apikeys.create_apikey.placeholder_apikey' | translate
              "
            ></app-ux-input>
            <app-ux-input
              controlName="secret_key"
              type="text"
              inputmode="text"
              [label]="'apikeys.create_apikey.label_secretkey' | translate"
              [placeholder]="
                'apikeys.create_apikey.placeholder_secretkey' | translate
              "
            ></app-ux-input>
          </div>
          <div>
            <div class="ik__submit_button">
              <ion-button
                class="ux_button"
                name="Submit"
                type="submit"
                color="uxsecondary"
                size="large"
              >
                {{ 'apikeys.create_apikey.save_button' | translate }}
              </ion-button>
            </div>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./new-api-keys.page.scss'],
})
export class NewApiKeysPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    api_key: ['', [Validators.required]],
    secret_key: ['', [Validators.required]],
  });
  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {}

  submitData() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
