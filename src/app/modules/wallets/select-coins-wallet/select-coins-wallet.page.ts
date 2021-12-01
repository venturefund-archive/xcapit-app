import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { ActivatedRoute } from '@angular/router';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
@Component({
  selector: 'app-select-coins-wallet',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ this.headerText | translate }}</ion-title>
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
              {{ this.submitButtonText | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>`,
  styleUrls: ['./select-coins-wallet.page.scss'],
})
export class SelectCoinsWalletPage implements OnInit {
  headerText: string;
  submitButtonText: string;
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
      BNB: [false],
      LUNA: [false],
      AXS: [false],
      MANA: [false],
      SUSHI: [false],
      COMP: [false],
      ZIL: [false],
      ENJ: [false],
      BAT: [false],
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

  almostOneChecked = false;
  allChecked = false;
  originalFormData: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private walletService: WalletService,
    private apiWalletService: ApiWalletService,
    private storageService: StorageService
  ) {}

  ionViewWillEnter() {
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.updateTexts();
    this.coins = this.apiWalletService.getCoins();
    this.ethCoins = this.coins.filter((coin) => coin.network === 'ERC20');
    this.rskCoins = this.coins.filter((coin) => coin.network === 'RSK');
    this.polygonCoins = this.coins.filter((coin) => coin.network === 'MATIC');

    if (this.mode === 'edit') {
      this.getUserCoins();
    }
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

  async handleSubmit() {
    if (this.almostOneChecked) {
      this.walletService.coins = [];
      this.setUserCoins();

      switch (this.mode) {
        case 'import':
          this.walletService.create();
          this.navController.navigateForward(['/wallets/create-password', 'import']);
          break;
        case 'edit':
          await this.storageService.toggleAssets(this.getChangedAssets());
          this.navController.navigateForward(['/tabs/wallets']);
          break;
        default:
          this.navController.navigateForward(['/wallets/create-first/recovery-phrase']);
          break;
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

  getUserCoins() {
    this.initializeFormData();

    this.storageService.getAssestsSelected().then((coins) => {
      coins.forEach((coin) => {
        const suite = this.getSuiteFromNetwork(coin.network);
        this.originalFormData[suite][coin.value] = true;
      });

      this.form.patchValue(this.originalFormData);
    });
  }

  private initializeFormData() {
    this.originalFormData = Object.assign({}, this.form.value);
  }

  private getSuiteFromNetwork(network: string): string {
    switch (network) {
      case 'ERC20':
        return 'ETH';
      case 'MATIC':
        return 'POLYGON';
      default:
        return network;
    }
  }

  private getChangedAssets(): string[] {
    const changedAssets = [];

    this.getAllSuites().forEach((suite) => {
      this.getAllCoinsBySuite(suite).forEach((key) => {
        if (this.form.value[suite][key] !== this.originalFormData[suite][key]) {
          changedAssets.push(key);
        }
      });
    });

    return changedAssets;
  }

  private updateTexts() {
    switch (this.mode) {
      case 'edit':
        this.headerText = 'wallets.select_coin.header_edit';
        this.submitButtonText = 'wallets.select_coin.submit_edit';
        return;
      case 'import':
        this.headerText = 'wallets.recovery_wallet.header';
        this.submitButtonText = 'deposit_addresses.deposit_currency.next_button';
        return;
      default:
        this.headerText = 'wallets.select_coin.header';
        this.submitButtonText = 'deposit_addresses.deposit_currency.next_button';
        return;
    }
  }
}
