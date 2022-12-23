import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { WalletEncryptionService } from '../../services/wallet-encryption/wallet-encryption.service';
import { WalletMnemonicService } from '../../services/wallet-mnemonic/wallet-mnemonic.service';
import { LoadingService } from '../../../../../shared/services/loading/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { PasswordErrorMsgs } from 'src/app/modules/swaps/shared-swaps/models/password/password-error-msgs';

@Component({
  selector: 'app-wallet-password-small',
  template: `
    <div class="wps">
      <div class="wps__header">
        <ion-text class="ux-font-text-lg wps__header__text">
          {{ 'wallets.shared_wallets.wallet_password_small.title' | translate }}
        </ion-text>
        <ion-button
          appTrackClick
          name="Close"
          class="wps__header__close_button"
          size="small"
          fill="clear"
          color="neutral80"
          (click)="this.close()"
        >
          <ion-icon name="close-outline"></ion-icon>
        </ion-button>
      </div>
      <form class="wps__form" [formGroup]="this.form">
        <div class="wps__form__input">
          <app-ux-input
            [label]="'wallets.shared_wallets.wallet_password_small.label' | translate"
            type="password"
            [textClass]="'primary'"
            controlName="password"
          ></app-ux-input>
        </div>
        <div class="wps__form__disclaimer">
          <div class="wps__form__disclaimer__icon">
            <ion-icon name="ux-info-circle-alt" color="infodark"></ion-icon>
          </div>
          <div class="wps__form__disclaimer__text">
            <ion-text class="ux-font-text-xxs">
              {{ 'wallets.shared_wallets.wallet_password_small.disclaimer' | translate }}
            </ion-text>
          </div>
        </div>
        <div class="wps__form__buttons">
          <ion-button
            color="secondary"
            appTrackClick
            name="Confirm Password"
            type="submit"
            (click)="this.handleSubmit()"
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
  form: UntypedFormGroup = this.formBuilder.group({
    password: ['', [Validators.required]],
  });

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalController: ModalController,
    private walletEncryptionService: WalletEncryptionService,
    private walletMnemonicService: WalletMnemonicService,
    private loadingService: LoadingService,
    private alertController: AlertController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  async handleSubmit() {
    if (this.form.valid) {
      await this.loadingService.show();
      this.walletEncryptionService
        .getDecryptedERC20Wallet(this.form.value.password)
        .then((wallet) => {
          this.walletMnemonicService.getMnemonic(wallet);
          this.modalController.dismiss();
        })
        .catch((error) => {
          if (new PasswordErrorMsgs().isInvalidError(error)) {
            this.showAlert();
          }
        })
        .finally(async () => {
          await this.loadingService.dismiss();
        });
    }
  }

  close() {
    this.modalController.dismiss();
  }

  private async showAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('wallets.shared_wallets.wallet_password_small.alert.header'),
      message: this.translate.instant('wallets.shared_wallets.wallet_password_small.alert.title'),
      cssClass: 'ux-wallet-error-alert ux-alert',
      buttons: [
        {
          text: this.translate.instant('wallets.shared_wallets.wallet_password_small.alert.button_text'),
          cssClass: 'primary',
        },
      ],
    });
    await alert.present();
  }
}
