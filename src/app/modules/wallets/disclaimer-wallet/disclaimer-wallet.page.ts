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
      <ion-text>{{ 'wallets.disclaimer.title' | translate }}</ion-text>
      <ion-text>{{ 'wallets.disclaimer.description' | translate }}</ion-text>
      <form [formGroup]="this.disclaimerForm">
        <div name="Disclaimer Form Checkboxes">
          <app-ux-checkbox
            controlName="localStoredKeysCheckbox"
            name="Local Stored Keys Checkbox"
            class="medium"
            [label]="'wallets.disclaimer.local_stored_keys_checkbox' | translate"
            ngClass="checkbox"
            color="uxsecondary"
            slot="start"
          ></app-ux-checkbox>
          <app-ux-checkbox
            controlName="recoveryPhraseCheckbox"
            name="Recovery Phrase Checkbox"
            class="medium"
            [label]="'wallets.disclaimer.recovery_phrase_checkbox' | translate"
            ngClass="checkbox"
            color="uxcombination"
            slot="start"
          ></app-ux-checkbox>
          <app-ux-checkbox
            controlName="termsOfUseCheckbox"
            name="Terms of Use Checkbox"
            [label]="'wallets.disclaimer.terms_of_use_checkbox' | translate"
            ngClass="checkbox"
            color="uxcombination"
            slot="start"
          ></app-ux-checkbox>
        </div>
        <div name="Disclaimer Form Buttons">
          <ion-button
            class="ux_button"
            appTrackClick
            name="Terms of Use Button"
            type="button"
            color="uxsecondary"
            size="large"
          >
            {{ 'wallets.disclaimer.terms_of_use_button' | translate }}
          </ion-button>
          <ion-button
            name="Submit"
            appTrackClick
            name="Terms of Use Button"
            type="submit"
            color="uxsecondary"
            size="large"
            [disabled]="!this.disclaimerForm.valid && (this.submitButtonService.isDisabled | async)"
          >
            {{ 'wallets.disclaimer.submit_button' | translate }}
          </ion-button>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./disclaimer-wallet.page.scss'],
})
export class DisclaimerWalletPage implements OnInit {
  hasAcceptedDisclaimer: boolean;
  disclaimerForm: FormGroup = this.formBuilder.group({
    localStoredKeysCheckbox: ['', [Validators.requiredTrue]],
    recoveryPhraseCheckbox: ['', [Validators.requiredTrue]],
    termsOfUseCheckbox: ['', [Validators.requiredTrue]],
  });

  constructor(private formBuilder: FormBuilder, public submitButtonService: SubmitButtonService) {}

  ngOnInit() {}
}
