import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COINS } from '../constants/coins';
import { NavController } from '@ionic/angular';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';

@Component({
  selector: 'app-select-coins-wallet',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wallets.select_coin.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
        <div class="ux_content">
          <app-ux-title class="ion-padding-top ion-margin-top ">
            <div class="ion-margin-top">
              {{ 'wallets.select_coin.title' | translate }}
            </div>
          </app-ux-title>

          <app-ux-text class="ion-padding-top ion-margin-top">
            <div class="ion-margin-top">
              {{ 'wallets.select_coin.subtitle' | translate }}
            </div>
          </app-ux-text>

          <app-ux-radio-group>
            <ion-list>
              <ion-radio-group>
                <div class="container">
                  <ion-item>
                    <ion-label class="ux-font-lato ux-fweight-bold ux-fsize-14">{{
                      'wallets.select_coin.select_all' | translate
                    }}</ion-label>
                    <ion-toggle class="sc__toggle" (ionChange)="toggleAll()" mode="ios" slot="end"></ion-toggle>
                  </ion-item>
                  <div class="list-divider"></div>
                  <app-item-coin
                    (change)="this.validate()"
                    [disabled]="this.isChecked"
                    [isChecked]="this.isChecked"
                    *ngFor="let coin of coins"
                    [coin]="coin"
                  ></app-item-coin>
                </div>
              </ion-radio-group>
            </ion-list>
          </app-ux-radio-group>
        </div>
        <div class="ux_footer">
          <div class="sc__next_button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Next"
              type="submit"
              size="large"
              [disabled]="!this.almostOneChecked"
            >
              {{ 'deposit_addresses.deposit_currency.next_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>`,
  styleUrls: ['./select-coins-wallet.page.scss'],
})
export class SelectCoinsWalletPage implements OnInit {
  coins = COINS;

  form: FormGroup = this.formBuilder.group({
    ETH: [false],
    RBTC: [false],
  });

  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private walletService: WalletService
  ) {}
  isChecked: boolean;
  almostOneChecked = false;

  ngOnInit() {}

  validate() {
    for (const field in this.form.controls) {
      if (this.form.controls.hasOwnProperty(field)) {
        this.enabledButton(this.isFieldTrue(field));
        if (this.isFieldTrue(field)) {
          break;
        }
      }
    }
  }

  isFieldTrue(field) {
    return this.form.controls[field].value === true;
  }

  enabledButton(isEnabled) {
    this.almostOneChecked = isEnabled;
  }

  toggleAll() {
    this.isChecked = !this.isChecked;
  }

  handleSubmit() {
    this.walletService.coins = [];

    if (this.almostOneChecked) {
      Object.keys(this.form.value).forEach((key) => {
        if (this.form.value[key]) {
          const coin = this.coins.find((coinRes) => coinRes.value === key);

          if (coin) this.walletService.coins.push(coin);
        }
      });

      this.navController.navigateForward(['/wallets/create-first/recovery-phrase']);
    }
  }
}
