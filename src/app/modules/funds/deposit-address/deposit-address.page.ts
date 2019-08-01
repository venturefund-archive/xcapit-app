import { Component, OnInit } from '@angular/core';
import { Currency } from '../shared-funds/enums/currency.enum';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import QRCode from 'qrcode';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { LogsService } from 'src/app/shared/services/logs/logs.service';
@Component({
  selector: 'app-deposit-address',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'funds.deposit_address.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{
              'funds.deposit_address.currency_card_title' | translate
            }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <form [formGroup]="this.form">
              <ion-item-group>
                <ion-item>
                  <ion-label position="floating">{{
                    'funds.deposit_address.currency' | translate
                  }}</ion-label>
                  <ion-select formControlName="currency">
                    <ion-select-option [value]="this.currencyEnum.BTC">
                      {{ this.currencyEnum.BTC }}
                    </ion-select-option>
                    <ion-select-option [value]="this.currencyEnum.USDT">
                      {{ this.currencyEnum.USD }}
                    </ion-select-option>
                  </ion-select>
                </ion-item>
              </ion-item-group>
            </form>
          </ion-card-content>
        </ion-card>
        <ion-card *ngIf="depositAddresInfo">
          <ion-card-header>
            <ion-card-title>{{
              'funds.deposit_address.deposit_address_card_title' | translate
            }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row
                *ngIf="depositAddresInfo.address"
                class="ion-align-items-center"
              >
                <ion-col size="3">{{
                  'funds.deposit_address.address' | translate
                }}</ion-col>
                <ion-col size="8">{{ depositAddresInfo.address }}</ion-col>
                <ion-col size="1">
                  <ion-buttons>
                    <ion-button (click)="this.copyToClipboard()">
                      <ion-icon slot="icon-only" name="copy"></ion-icon>
                    </ion-button>
                  </ion-buttons>
                </ion-col>
              </ion-row>
              <ion-row
                *ngIf="depositAddresInfo.addressTag"
                class="ion-align-items-center"
              >
                <ion-col>{{
                  'funds.deposit_address.address_tag' | translate
                }}</ion-col>
                <ion-col>{{ depositAddresInfo.addressTag }}</ion-col>
              </ion-row>
              <ion-row
                *ngIf="depositAddresInfo.url"
                class="ion-align-items-center"
              >
                <ion-col size="3">{{
                  'funds.deposit_address.link' | translate
                }}</ion-col>
                <ion-col size="8">
                  {{ depositAddresInfo.url }}
                </ion-col>
                <ion-col size="1">
                  <ion-buttons>
                    <ion-button
                      (click)="this.openAddressUrlInNewTab()"
                    >
                      <ion-icon slot="icon-only" name="open"></ion-icon>
                    </ion-button>
                  </ion-buttons>
                </ion-col>
              </ion-row>
              <ion-row class="ion-padding" *ngIf="this.qrCode">
                <ion-col>
                  <div class="qr-code-container">
                    <img
                      [src]="this.qrCode"
                      width="70%"
                      alt="Address link QR Code"
                    />
                  </div>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styleUrls: ['./deposit-address.page.scss']
})
export class DepositAddressPage implements OnInit {
  currencyEnum = Currency;
  form: FormGroup = this.formBuilder.group({
    currency: ['', [Validators.required]]
  });
  depositAddresInfo: any;
  qrCode: string;
  constructor(
    private formBuilder: FormBuilder,
    private apiFunds: ApiFundsService,
    private clipboard: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService,
    private logsService: LogsService
  ) {}

  getDepositAdress(currency: string) {
    this.apiFunds.getDepositAdress(currency).subscribe(res => {
      this.logsService
      .log(
        `{"message": "Has requested deposit address"}`
      ).subscribe();
      this.depositAddresInfo = res;
      if (this.depositAddresInfo.url) {
        this.generateQR(this.depositAddresInfo.url);
      }
    });
  }

  generateQR(depositAddressUrl: string) {
    QRCode.toDataURL(depositAddressUrl)
      .then(url => {
        this.qrCode = url;
      })
      .catch(err => {
        console.error(err);
      });
  }

  ionViewDidEnter() {
    this.logsService
    .log(
      `{"message": "Has entered deposit-address"}`
    ).subscribe();
    this.form.valueChanges.subscribe(data => {
      if (data.currency) {
        this.getDepositAdress(data.currency);
      }
    });
  }
  ngOnInit() {}

  openAddressUrlInNewTab() {
    if (this.depositAddresInfo.url) {
      // esto se usa porque ionic tiene un bug en que el ion-button no
      // toma los attr target y rel, si se actualiza a una versión
      // >= a la 4.6 debería estar resuelto
      window.open(this.depositAddresInfo.url, '_blank');
    }
  }

  copyToClipboard() {
    if (this.depositAddresInfo.address) {
      this.clipboard
        .copy(this.depositAddresInfo.address)
        .then(
          () => {
            this.logsService
            .log(
              `{"message": "Has copied deposit address"}`
            ).subscribe();
            this.showToast('funds.deposit_address.copy_address_ok_text')},
          () => {
            this.logsService
            .log(
              `{"message": "Error trying to copy deposit address"}`
            ).subscribe();
            this.showToast('funds.deposit_address.copy_address_error_text')}
        );
    }
  }

  private showToast(text: string) {
    this.toastService.showToast({
      message: this.translate.instant(text)
    });
  }
}
