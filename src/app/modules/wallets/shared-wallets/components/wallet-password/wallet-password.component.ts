import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-wallet-password',
  template: `
    <div class="wp">
      <div class="wp__header">
        <ion-text class="ux-font-text-lg wp__header__text" color="uxdark">
          {{ this.title }}
        </ion-text>
        <ion-button
          appTrackClick
          name="Close"
          class="wp__header__close_button"
          size="small"
          fill="clear"
          (click)="this.close()"
        >
          <ion-icon name="close-outline"></ion-icon>
        </ion-button>
      </div>
      <div class="wp__description">
        <ion-text class="ux-font-text-base">
          {{ this.description }}
        </ion-text>
      </div>
      <form class="wp__form" [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
        <div class="wp__form__input">
          <app-ux-input [label]="this.inputLabel" type="password" controlName="password"></app-ux-input>
        </div>
        <div class="wp__form__disclaimer">
          <ion-text class="ux-font-text-xsg">
            {{ this.disclaimer }}
          </ion-text>
        </div>
        <div class="wp__form__buttons ux-font-button">
          <ion-button
            color="uxsecondary"
            appTrackClick
            [dataToTrack]="{ eventLabel: this.trackClickEventName }"
            name="Confirm Password"
            type="submit"
            [disabled]="!this.form.valid"
            >{{ this.submitButtonText }}</ion-button
          >
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./wallet-password.component.scss'],
})
export class WalletPasswordComponent implements OnInit {
  // TODO: Test this
  @Input() state: string;

  title = this.translate.instant('wallets.shared_wallets.wallet_password.title');
  disclaimer = this.translate.instant('wallets.shared_wallets.wallet_password.disclaimer');
  submitButtonText = this.translate.instant('wallets.shared_wallets.wallet_password.submit_button_text');
  inputLabel = this.translate.instant('wallets.shared_wallets.wallet_password.input_label');
  description = '';

  form: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required]],
  });

  get trackClickEventName(): string {
    if (this.state) 
      return `ux_${this.state}_confirm_password`;

    return 'Confirm Password';
  }
  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  async handleSubmit() {
    if (this.form.valid) await this.modalController.dismiss(this.form.value.password);
  }

  close() {
    this.modalController.dismiss();
  }
}
