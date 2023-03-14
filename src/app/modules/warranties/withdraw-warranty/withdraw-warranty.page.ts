import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-withdraw-warranty',
  template: `<ion-header>
      <div></div>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded ux_toolbar__left no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-start">{{ 'warranties.withdraw_warranty.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ww ion-padding">
      <form [formGroup]="this.form">
        <div class="ww__withdraw-amount-card ux-card ion-padding no-border">
          <div class="ww__withdraw-amount-card__title ux-font-text-xl">{{ 'warranties.withdraw_warranty.title' | translate }}</div>
          <div class="ww__withdraw-amount-card__input">
            <app-ux-input
              type="number"
              controlName="dni"
              inputmode="number"
              [labelColor]="'primary'"
              [label]="'warranties.withdraw_warranty.text_dni' | translate"
              [placeholder]="'DNI'"
            ></app-ux-input>
            <div class="ww__withdraw-amount-card__subtitle ux-font-text-base">{{ 'warranties.withdraw_warranty.subtitle' | translate }}</div>
          </div>
        </div>
      </form>
      <div class="ww__support">
        <app-whatsapp-support> </app-whatsapp-support>
      </div>
    </ion-content>
    <ion-footer class="ww__footer">
      <div class="ww__footer__submit-button ion-padding">
        <ion-button
          class="ux_button ww__footer__submit-button__button"
          appTrackClick
          name="ux_warranty_withdraw_DNI"
          color="secondary"
          expand="block"
          (click)="this.submitForm()"
          [disabled]="!this.form.valid"
          >{{ 'wallets.send.send_detail.continue_button' | translate }}</ion-button
        >
      </div>
    </ion-footer>`,
  styleUrls: ['./withdraw-warranty.page.scss'],
})
export class WithdrawWarrantyPage implements OnInit {
  form: UntypedFormGroup = this.formBuilder.group({
    dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(9), Validators.pattern('[0-9]*$')]],
  })
  constructor(
    private formBuilder: UntypedFormBuilder,
  ) {}

  ngOnInit() {

  }

  submitForm() {
    return null
  }
}
