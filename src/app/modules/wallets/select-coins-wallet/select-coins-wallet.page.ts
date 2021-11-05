import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { ActivatedRoute } from '@angular/router';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
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
        <div class="sc__content ux_content">
          <app-ux-title class="ion-padding-top ion-margin-top ">
            <div class="sc__title ux-font-text-lg ion-margin-top">
              {{ 'wallets.select_coin.title' | translate }}
            </div>
          </app-ux-title>
          <app-ux-text class="ion-padding-top ion-margin-top">
            <div class="sc__subtitle ux-font-text-base">
              {{ 'wallets.select_coin.subtitle' | translate }}
            </div>
          </app-ux-text>
          <app-ux-text>
            <div class="sc__recordatory ux-font-text-xxs">
              {{ 'wallets.select_coin.recordatory' | translate }}
            </div>
          </app-ux-text>
          <app-items-coin-group *ngIf="this.ethCoins" suite="ETH" [coins]="this.ethCoins"></app-items-coin-group>
          <app-items-coin-group *ngIf="this.rskCoins" suite="RSK" [coins]="this.rskCoins"></app-items-coin-group>
          <app-items-coin-group
            *ngIf="this.polygonCoins"
            suite="POLYGON"
            [coins]="this.polygonCoins"
          ></app-items-coin-group>
        </div>
        <div class="ux_footer">
          <div class="sc__next_button">
            <ion-button
              [disabled]="!this.almostOneChecked"
              color="uxsecondary"
              class="ux_button"
              appTrackClick
              name="Next"
              type="submit"
              size="large"
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
  coins: Coin[];
  mode: string;
  ethCoins: Coin[];
  rskCoins: Coin[];
  polygonCoins: Coin[];

  form: FormGroup = this.formBuilder.group({
    ETH: this.formBuilder.group({
      ETH: [false],
      LINK: [false],
      USDT: [false],
      AAVE: [false],
      UNI: [false],
    }),
    RSK: this.formBuilder.group({
      RBTC: [false],
      RIF: [false],
      SOV: [false],
    }),
    POLYGON: this.formBuilder.group({
      MATIC: [false],
    }),
  });

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private walletService: WalletService,
    private apiWalletService: ApiWalletService
  ) {}
  almostOneChecked = false;
  allChecked = false;

  ionViewWillEnter() {
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.coins = this.apiWalletService.getCoins();
    this.ethCoins = this.coins.filter((coin) => coin.network === 'ERC20');
    this.rskCoins = this.coins.filter((coin) => coin.network === 'RSK');
    this.polygonCoins = this.coins.filter((coin) => coin.network === 'MATIC');
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => this.setContinueButtonState());
  }

  almostOneToggledInSuite(suite) {
    return Object.values(this.form.value[suite]).some(Boolean);
  }

  setContinueButtonState() {
    this.almostOneChecked = this.almostOneToggled();
  }

  almostOneToggled() {
    const suites = Object.keys(this.form.value);
    return suites.map((suite) => this.almostOneToggledInSuite(suite)).some(Boolean);
  }

  handleSubmit() {
    if (this.almostOneChecked) {
      this.walletService.coins = [];
      this.setUserCoins();
      if (this.mode === 'import') {
        this.walletService.create();
        this.navController.navigateForward(['/wallets/create-password', 'import']);
      } else {
        this.navController.navigateForward(['/wallets/create-first/recovery-phrase']);
      }
    }
  }

  getAllSuites() {
    return Object.keys(this.form.value);
  }

  getAllCoinsBySuite(suite) {
    return Object.keys(this.form.value[suite]);
  }

  setUserCoins() {
    this.getAllSuites().forEach((suite) => {
      this.getAllCoinsBySuite(suite).forEach((key) => {
        if (this.form.value[suite][key]) {
          const coin = this.coins.find((coinRes) => coinRes.value === key);
          if (coin) this.walletService.coins.push(coin);
        }
      });
    });
  }
}
