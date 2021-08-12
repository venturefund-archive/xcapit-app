import { Component, OnInit } from '@angular/core';
import { COINS } from '../constants/coins';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QRCodeService } from '../../../shared/services/qr-code/qr-code.service';
import { ShareService } from '../../../shared/services/share/share.service';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-receive',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'Recibir' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-start ion-padding-end wr">
      <div class="wr__title">
        <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">{{
          'Datos de tu billetera' | translate
        }}</ion-text>
      </div>
      <div class="wr__currency-select">
        <ion-text class="ux-font-lato ux-fweight-semibold ux-fsize-12">{{ 'Moneda' | translate }}</ion-text>
        <form [formGroup]="this.form">
          <app-ux-input-select
            [modalTitle]="'Seleccionar moneda' | translate"
            [placeholder]="'Currency'"
            controlName="currency"
            [data]="this.currencies"
            [keyName]="'name'"
            [valueName]="'id'"
          ></app-ux-input-select>
        </form>
      </div>
      <div class="wr__remaining-time-text">
        <ion-text color="uxsemidark" class="ux-font-lato ux-fweight-regular ux-fsize-12">{{
          'Tiempo promedio de llegada: 3 min' | translate
        }}</ion-text>
      </div>
      <div class="wr__qr-content" *ngIf="addressQr">
        <ion-img id="qr-img" [src]="this.addressQr"></ion-img>
      </div>
      <div class="wr__receive-address">
        <ion-button
          name="Copy Wallet Address"
          appTrackClick
          id="copy-address-button"
          fill="clear"
          (click)="this.copyAddress()"
        >
          <ion-label class="ux-font-lato ux-fsize-16 ux-fweight-regular">{{ this.address }}</ion-label>
          <ion-icon name="copy-outline" style="margin-left: 8px;"></ion-icon
        ></ion-button>
      </div>
      <div class="wr__share-content">
        <ion-button
          name="Share Wallet Address"
          id="share-address-button"
          appTrackClick
          fill="clear"
          class="ux-font-lato ux-fsize-16 ux-fweight-regular"
          (click)="this.shareAddress()"
          >{{ 'Compartir' | translate }} <ion-icon name="ux-share" style="margin-left: 8px;"></ion-icon
        ></ion-button>
      </div>
      <div class="wr__disclaimer">
        <ion-text class="ux-font-lato ux-fweight-bold ux-fsize-12">
          {{ 'Envíe solo USDT a esta direción de depósito.' | translate }}
        </ion-text>
        <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-12">
          {{
            'Enviar otras monedas o tokens a esta dirección distintas a USDT puede resultar en la pérdida de su depósito.'
              | translate
          }}
        </ion-text>
      </div>
    </ion-content>
  `,
  styleUrls: ['./receive.page.scss'],
})
export class ReceivePage {
  form: FormGroup = this.formBuilder.group({
    currency: ['', Validators.required],
  });
  currencies: Coin[] = COINS.filter((coin) => coin.value === 'ETH');
  address = '0xAE28be68e2C37c2Cf7B4144cb83537Dbf48Ce8a5';
  addressQr: string;

  constructor(
    private formBuilder: FormBuilder,
    private qrCodeService: QRCodeService,
    private clipboardService: ClipboardService,
    private shareService: ShareService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ionViewWillEnter() {
    this.generateAddressQR();
  }

  async copyAddress() {
    await this.clipboardService
      .write({
        string: this.address,
      })
      .then(
        () => {
          this.showToast('deposit_addresses.deposit_address.copy_address_ok_text'); //TODO: Cambiar de deposit address a otro lado
        },
        () => {
          this.showToast('deposit_addresses.deposit_address.copy_address_error_text');
        }
      );
  }

  private showToast(text: string) {
    this.toastService.showToast({
      message: this.translate.instant(text),
    });
  }

  async shareAddress() {
    // TODO: Translate de textos
    await this.shareService.share(
      {
        title: 'Direccion de wallet',
        dialogTitle: 'Direccion de wallet',
        text: 'test_address',
      },
      'Error al compartir'
    );
  }

  generateAddressQR() {
    this.qrCodeService.generateQRFromText(this.address).then((qr) => (this.addressQr = qr));
  }
}
