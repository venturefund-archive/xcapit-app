import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { WalletEncryptionService } from '../../services/wallet-encryption/wallet-encryption.service';
import { WalletConnectService } from '../../services/wallet-connect/wallet-connect.service';
import { EthersService } from '../../services/ethers/ethers.service';
import { LoadingService } from '../../../../../shared/services/loading/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wallet-connect-sign-request',
  template: `
    <div class="wcsr">
      <div class="wcsr__header">
        <ion-text class="ux-font-text-lg wcsr__header__text">
          {{ 'wallets.shared_wallets.wallet_password_small.title' | translate }}
        </ion-text>
        <ion-button
          appTrackClick
          name="Close"
          class="wcsr__header__close_button"
          size="small"
          fill="clear"
          color="uxsemidark"
          (click)="this.close()"
        >
          <ion-icon name="close-outline"></ion-icon>
        </ion-button>
      </div>
      <form class="wcsr__form" [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
        <div class="wcsr__form__input">
          <app-ux-input
            [label]="'wallets.shared_wallets.wallet_password_small.label' | translate"
            type="password"
            controlName="password"
          ></app-ux-input>
        </div>
        <div class="wcsr__form__disclaimer">
          <div class="wcsr__form__disclaimer__icon">
            <ion-icon name="ux-info-circle-alt" color="infodark"></ion-icon>
          </div>
          <div class="wcsr__form__disclaimer__text">
            <ion-text class="ux-font-text-xxs">
              {{ 'wallets.shared_wallets.wallet_password_small.disclaimer' | translate }}
            </ion-text>
          </div>
        </div>
        <div class="wcsr__form__buttons">
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
  styleUrls: ['./wallet-connect-sign-request.component.scss'],
})
export class WalletConnectSignRequestComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private modalController: ModalController,
    private walletEncryptionService: WalletEncryptionService,
    private walletConnectService: WalletConnectService,
    private loadingService: LoadingService,
    private alertController: AlertController,
    private translate: TranslateService,
    private ethersService: EthersService
  ) {}

  ngOnInit() {}

  async handleSubmit() {
    if (this.form.valid) {
      await this.loadingService.show();
      this.walletEncryptionService
        .getDecryptedWalletForNetwork(this.form.value.password, this.walletConnectService.network)
        .then(async (wallet) => {
          const provider = this.ethersService.newProvider(this.walletConnectService.rpcUrl);
          wallet = wallet.connect(provider);
          const res = await this.walletConnectService.checkRequest(this.walletConnectService.requestInfo, wallet);

          if (!!res.error && res.error === true) {
            this.showAlertTxError();
          } else {
            this.modalController.dismiss(false);
          }
        })
        .catch((error) => {
          if (error.message === 'invalid password') {
            this.showAlert();
          }
        })
        .finally(async () => {
          await this.loadingService.dismiss();
        });
    }
  }

  close() {
    this.modalController.dismiss(undefined);
  }

  private async showAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('wallets.shared_wallets.wallet_password_small.alert.header'),
      message: this.translate.instant('wallets.shared_wallets.wallet_password_small.alert.title'),
      cssClass: 'ux-wallet-error-alert ux-alert',
      buttons: [
        {
          text: this.translate.instant('wallets.shared_wallets.wallet_password_small.alert.button_text'),
          cssClass: 'uxprimary',
        },
      ],
    });
    await alert.present();
  }

  private async showAlertTxError() {
    const alert = await this.alertController.create({
      header: this.translate.instant('wallets.wallet_connect.transactions.alert.header'),
      message: this.translate.instant('wallets.wallet_connect.transactions.alert.message'),
      cssClass: 'ux-wallet-error-alert ux-alert',
      buttons: [
        {
          text: this.translate.instant('wallets.wallet_connect.transactions.alert.accept_button'),
          handler: async () => {
            this.modalController.dismiss(true);
          },
        },
      ],
    });
    await alert.present();
  }
}
