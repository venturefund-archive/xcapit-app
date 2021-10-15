import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { COINS } from '../constants/coins';
import { NavController } from '@ionic/angular';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-coins-wallet',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title *ngIf="this.mode === 'import'" class="ion-text-center">{{
          'wallets.recovery_wallet.header' | translate
        }}</ion-title>
        <ion-title *ngIf="this.mode !== 'import'">{{ 'wallets.select_coin.header' | translate }}</ion-title>
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
            <div class="subtitle ux-font-text-xs ion-margin-top">
              {{ 'wallets.select_coin.subtitle' | translate }}
            </div>
          </app-ux-text>

          <app-ux-radio-group>
            <ion-list>
              <ion-radio-group>
                <div class="container">
                  <ion-item>
                    <ion-label class="ux-font-text-xxs">{{ 'wallets.select_coin.select_all' | translate }}</ion-label>
                    <ion-toggle
                      name="AllToggle"
                      class="sc__toggle"
                      [checked]="this.allChecked"
                      (click)="toggleAll($event)"
                      mode="ios"
                      slot="end"
                    ></ion-toggle>
                  </ion-item>
                  <div class="list-divider"></div>
                  <app-item-coin
                    (change)="this.validate($event)"
                    [isChecked]="this.form.value.coin"
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
  mode: string;

  form: FormGroup = this.formBuilder.group({
    ETH: [false],
    LINK: [false],
    USDT: [false],
    AAVE: [false],
    UNI: [false],
    RBTC: [false],
    RIF: [false],
    MATIC: [false],
  });

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private walletService: WalletService
  ) {}
  almostOneChecked = false;
  allChecked = false;

  ionViewWillEnter() {
    this.mode = this.route.snapshot.paramMap.get('mode');
  }

  ngOnInit() {}

  validate(event) {
    this.setToggleAllState();
    this.setContinueButtonState();
    this.checkIfNativeCoinFromNetworkIsChecked(event);
  }

  setToggleAllState() {
    this.allChecked = this.allToggled();
  }

  setContinueButtonState() {
    this.almostOneChecked = this.almostOneToggled();
  }
  allToggled(): boolean {
    return Object.values(this.form.value).every((value) => value === true);
  }

  almostOneToggled() {
    return Object.values(this.form.value).some((value) => value === true);
  }

  toggleAll(event: any) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();

    this.allToggled() ? this.selectAll(false) : this.selectAll(true);
    this.setToggleAllState();
    this.setContinueButtonState();
  }

  selectAll(select: boolean) {
    const allCoins = {};
    Object.keys(this.form.value).forEach((coin) => {
      allCoins[coin] = select;
    });
    this.form.patchValue(allCoins);
  }

  checkIfNativeCoinFromNetworkIsChecked(event: any) {
    const toggledCoin = event.detail.value;
    const isToggledCoinChecking = event.detail.checked;
    const nativeCoin = this.coins.find((coin) => coin.network === toggledCoin.network && coin.native === true).value;

    if (toggledCoin.native && !isToggledCoinChecking) {
      this.deselectAllNetworkCoins(toggledCoin.network);
    }
    if (!toggledCoin.native && isToggledCoinChecking) {
      this.checkNativeCoin(nativeCoin);
    }
  }

  deselectAllNetworkCoins(network: string) {
    const allMappedNetworkCoins = {};
    const allNetworkCoins = this.coins.filter((coin) => coin.network === network);
    allNetworkCoins.forEach((coin) => {
      allMappedNetworkCoins[coin.value] = false;
    });
    this.form.patchValue(allMappedNetworkCoins);
  }

  checkNativeCoin(nativeCoin) {
    this.form.patchValue({ [nativeCoin]: true });
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
      if (this.mode === 'import') {
        this.walletService.create();
        this.navController.navigateForward(['/wallets/create-password', 'import']);
      } else {
        this.navController.navigateForward(['/wallets/create-first/recovery-phrase']);
      }
    }
  }
}
