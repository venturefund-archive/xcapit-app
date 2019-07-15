import { Component, OnInit } from '@angular/core';
import { Currency } from '../shared-funds/enums/currency.enum';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import QRCode from 'qrcode';
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
              <ion-row *ngIf="depositAddresInfo.address">
                <ion-col>{{
                  'funds.deposit_address.address' | translate
                }}</ion-col>
                <ion-col>{{ depositAddresInfo.address }}</ion-col>
              </ion-row>
              <ion-row *ngIf="depositAddresInfo.addressTag">
                <ion-col>{{
                  'funds.deposit_address.address_tag' | translate
                }}</ion-col>
                <ion-col>{{ depositAddresInfo.addressTag }}</ion-col>
              </ion-row>
              <ion-row *ngIf="depositAddresInfo.url">
                <ion-col>{{
                  'funds.deposit_address.link' | translate
                }}</ion-col>
                <ion-col>{{ depositAddresInfo.url }}</ion-col>
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
    private apiFunds: ApiFundsService
  ) {}

  getDepositAdress(currency: string) {
    this.apiFunds.getDepositAdress(currency).subscribe(res => {
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
    this.form.valueChanges.subscribe(data => {
      if (data.currency) {
        this.getDepositAdress(data.currency);
      }
    });
  }
  ngOnInit() {}
}
