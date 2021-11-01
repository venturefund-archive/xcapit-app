import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-wallet-password-small',
  template: `
    <div class="wps ion-padding">
      <div class="wps__header">
        <ion-text class="ux-font-text-lg wp__header__text" color="uxprimary">
          {{ 'wallets.shared_wallets.wallet_password_small.title' | translate }}
        </ion-text>
        <ion-button
          appTrackClick
          name="Close"
          class="wps__header__close_button"
          size="small"
          fill="clear"
          (click)="this.close()"
        >
          <ion-icon name="close-outline"></ion-icon>
        </ion-button>
      </div>
      <form class="wps__form" [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
        <div class="wps__form__input">
          <app-ux-input
            [label]="'wallets.shared_wallets.wallet_password_small.label' | translate"
            type="password"
            controlName="password"
          ></app-ux-input>
        </div>
        <div class="wps__form__disclaimer">
          <ion-icon name="ux-info-circle-alt" color="infodark"></ion-icon>
          <ion-text class="ux-font-text-xxs" color="infodark">
            {{ 'wallets.shared_wallets.wallet_password_small.disclaimer' | translate }}
          </ion-text>
        </div>
        <div class="wps__form__buttons">
          <ion-button
            color="uxsecondary"
            appTrackClick
            name="Confirm Password"
            type="submit"
            [disabled]="!this.form.valid"
          >
            {{ 'wallets.shared_wallets.wallet_password_small.button_text' | translate }}
          </ion-button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./wallet-password-small.component.scss'],
})
export class WalletPasswordSmallComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required]],
  });

  constructor(private formBuilder: FormBuilder, private modalController: ModalController) {}

  ngOnInit() {}

  async handleSubmit() {
    if (this.form.valid) {
      await this.modalController.dismiss(this.form.value.password);
    }
  }

  close() {
    this.modalController.dismiss();
  }
}
