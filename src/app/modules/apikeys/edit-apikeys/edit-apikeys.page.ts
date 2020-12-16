import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;
@Component({
  selector: 'app-edit-apikeys',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="this.goToFundSettings()"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{
          'apikeys.edit_apikey.header' | translate
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
          <div class="eak__ak_input">
            <app-ux-input
              controlName="api_key"
              type="text"
              inputmode="text"
              [label]="'apikeys.edit_apikey.public_key' | translate"
              [placeholder]="'apikeys.edit_apikey.key_placeholder' | translate"
            ></app-ux-input>
          </div>
          <div class="eak__ak_input">
            <app-ux-input
              controlName="secret_key"
              type="text"
              inputmode="text"
              [label]="'apikeys.edit_apikey.secret_key' | translate"
              [placeholder]="'apikeys.edit_apikey.key_placeholder' | translate"
            ></app-ux-input>
            <div class="eak__need_help">
              <ion-label
                class="ux-font-lato ux-fweight-semibold ux-fsize-12"
                color="uxsecondary"
                (click)="this.openTutorialApiKey()"
              >
                {{ 'apikeys.edit_apikey.need_help' | translate }}
              </ion-label>
            </div>
          </div>
        </div>
        <div class="ux_footer">
          <div class="eak__submit_button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Edit ApiKey"
              type="submit"
              color="uxsecondary"
              size="large"
              [disabled]="this.submitButtonService.isDisabled | async"
            >
              {{ 'apikeys.edit_apikey.submit_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./edit-apikeys.page.scss'],
})
export class EditApiKeyPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    api_key: ['', [Validators.required]],
    secret_key: ['', [Validators.required]],
  });

  fundName: string;

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private route: ActivatedRoute,
    private apiApikeysService: ApiApikeysService
  ) {
    Browser.prefetch({
      urls: ['https://www.info.xcapit.com/tutorial/binance_apikey.html'],
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('fundName');
  }

  handleSubmit() {
    if (this.form.valid) {
      const data = this.form.value;
      this.apiApikeysService.crud
        .update(data, this.fundName)
        .subscribe(() => this.success());
    } else {
      this.form.markAllAsTouched();
    }
  }
  success() {
    this.navController.navigateForward(['/apikeys/success', 'edit']);
  }

  goToFundSettings() {
    this.navController.navigateForward(['/funds/fund-settings', this.fundName]);
  }

  async openTutorialApiKey() {
    await Browser.open({
      toolbarColor: 'red',
      url: 'https://www.info.xcapit.com/tutorial/binance_apikey.html',
    });
  }
}
