import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';

@Component({
  selector: 'app-disclaimer-wallet',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.disclaimer.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="this.disclaimerForm" class="ux_main">
        <div class="ux_content">
          <div>
            <ion-text name="Title" class="ux-font-gilroy ux-fsize-22 ux-fweight-bold">{{
              'wallets.disclaimer.title' | translate
            }}</ion-text>
          </div>
          <div class="description">
            <ion-text name="Description" class="ux-font-lato ux-fsize-14 ux-fweight-normal">{{
              'wallets.disclaimer.description' | translate
            }}</ion-text>
          </div>
          <div name="Disclaimer Form Checkboxes" class="checkbox_card ion-padding">
            <div>
              <div class="checkbox">
                <app-ux-checkbox
                  controlName="localStoredKeysCheckbox"
                  name="Local Stored Keys Checkbox"
                  [label]="'wallets.disclaimer.local_stored_keys_checkbox' | translate"
                  ngClass="checkbox"
                  color="uxsecondary"
                  slot="start"
                ></app-ux-checkbox>
              </div>

              <div class="checkbox">
                <app-ux-checkbox
                  controlName="recoveryPhraseCheckbox"
                  name="Recovery Phrase Checkbox"
                  [label]="'wallets.disclaimer.recovery_phrase_checkbox' | translate"
                  ngClass="checkbox"
                  color="uxsecondary"
                  slot="start"
                ></app-ux-checkbox>
              </div>

              <div class="checkbox">
                <app-ux-checkbox
                  controlName="termsOfUseCheckbox"
                  name="Terms of Use Checkbox"
                  [label]="'wallets.disclaimer.terms_of_use_checkbox' | translate"
                  ngClass="checkbox"
                  color="uxsecondary"
                  slot="start"
                ></app-ux-checkbox>
              </div>
            </div>
          </div>
        </div>
        <div name="Disclaimer Form Buttons" class="ux_footer">
          <div class="button">
            <ion-button
              class=""
              appTrackClick
              name="Terms of Use Button"
              type="button"
              color="uxsecondary"
              size="small"
              fill="clear"
            >
              {{ 'wallets.disclaimer.terms_of_use_button' | translate }}
            </ion-button>
          </div>
          <div class="button">
            <ion-button
              class="ux_button"
              name="Submit"
              appTrackClick
              name="Terms of Use Button"
              type="submit"
              color="uxsecondary"
              size="large"
              [disabled]="!this.disclaimerForm.valid || (this.submitButtonService.isDisabled | async)"
            >
              {{ 'wallets.disclaimer.submit_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./disclaimer-wallet.page.scss'],
})
export class DisclaimerWalletPage implements OnInit {
  hasAcceptedDisclaimer: boolean;
  disclaimerForm: FormGroup = this.formBuilder.group({
    localStoredKeysCheckbox: [false, [Validators.requiredTrue]],
    recoveryPhraseCheckbox: [false, [Validators.requiredTrue]],
    termsOfUseCheckbox: [false, [Validators.requiredTrue]],
  });

  constructor(private formBuilder: FormBuilder, public submitButtonService: SubmitButtonService) {}

  ngOnInit() {}

  test() {
    console.log(this.disclaimerForm.valid);
  }
}
