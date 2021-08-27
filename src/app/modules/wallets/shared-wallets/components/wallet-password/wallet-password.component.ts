import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-wallet-password',
  template: `
    <div class="wp ion-padding">
      <div class="wp__title">
        <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-18">{{ this.title }}</ion-text>
      </div>
      <form class="wp__form" [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
        <div class="wp__form__input">
          <app-ux-input [label]="this.inputLabel" type="password" controlName="password"></app-ux-input>
        </div>
        <div class="wp__form__disclaimer">
          <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-12">
            {{ this.disclaimer }}
          </ion-text>
        </div>
        <div class="wp__form__buttons">
          <ion-button appTrackClick name="Confirm Password" type="submit" [disabled]="!this.form.valid">{{
            this.submitButtonText
          }}</ion-button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./wallet-password.component.scss'],
})
export class WalletPasswordComponent implements OnInit {
  title: string = this.translate.instant('wallets.shared_wallets.wallet_password.title');
  disclaimer: string = this.translate.instant('wallets.shared_wallets.wallet_password.disclaimer');
  submitButtonText: string = this.translate.instant('wallets.shared_wallets.wallet_password.submit_button_text');
  inputLabel: string = this.translate.instant('wallets.shared_wallets.wallet_password.input_label');

  form: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required]],
  });
  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  async handleSubmit() {
    if (this.form.valid) await this.modalController.dismiss(this.form.value.password);
  }
}
