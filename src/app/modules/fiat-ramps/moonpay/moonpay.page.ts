import { environment } from './../../../../../variables.env';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { ActivatedRoute } from '@angular/router';
import { WalletEncryptionService } from '../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { FiatRampOperation } from '../shared-ramps/models/fiat-ramp-operation';

@Component({
  selector: 'app-moonpay',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'fiat_ramps.moonpay.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-start ion-padding-end">
      <ion-card class="ux-card-new mnp">
        <div class="mnp__currency-select">
          <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.moonpay.currency_label' | translate }}</ion-text>
          <form [formGroup]="this.form">
            <app-input-select
              [modalTitle]="'wallets.receive.select_coins' | translate"
              [placeholder]="'wallets.receive.select_coins' | translate"
              controlName="currency"
              [data]="this.coins"
              key="name"
              valueKey="value"
              imageKey="logoRoute"
              selectorStyle="white"
            ></app-input-select>
          </form>
        </div>
        <div class="mnp__provider">
          <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.moonpay.provider.label' | translate }}</ion-text>
          <ion-card class="ux-card-new mnp__provider__content">
            <div class="mnp__provider__content__img ion-padding-start ion-padding-end">
              <img src="assets/img/fiat-ramps/providers/Moonpay.svg" />
            </div>
            <div class="mnp__provider__content__text">
              <ion-text class="ux-font-text-lg mnp__provider__content__text__name">{{
                'fiat_ramps.moonpay.provider.name' | translate
              }}</ion-text>
              <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.moonpay.provider.description' | translate }}</ion-text>
            </div>
            <div class="mnp__provider__content__icon ion-padding-end">
              <ion-icon name="ux-info-circle-outline" slot="end" color="info"></ion-icon>
            </div>
          </ion-card>
        </div>
        <div class="mnp__disclaimer">
          <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.moonpay.disclaimer' | translate }}</ion-text>
        </div>
        <div class="mnp__information">
          <ion-text class="ux-font-text-xxs" color="neutral50">{{
            'fiat_ramps.moonpay.information' | translate
          }}</ion-text>
        </div>
      </ion-card>
      <div class="operations-list">
        <app-operations-list [operationsList]="this.operationsList"></app-operations-list>
      </div>
      <div class="moonpay-operations">
        <ion-text class="ux-font-text-xxs">
          {{ 'fiat_ramps.moonpay.moonpay_operations' | translate }}
        </ion-text>
        <ion-button
          fill="clear"
          type="button"
          appTrackClick
          name="Go To Moonpay History"
          (click)="this.goToMoonpay()"
          class="ux-link-xs moonpay-operations__link"
        >
          https://buy.moonpay.com/trade_history
        </ion-button>
      </div>
      <ion-button
        appTrackClick
        name="Continue to Moonpay"
        expand="block"
        size="large"
        type="submit"
        class="ux_button"
        color="secondary"
        (click)="this.openMoonpay()"
      >
        {{ 'fiat_ramps.moonpay.button_text' | translate }}
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./moonpay.page.scss'],
})
export class MoonpayPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    currency: ['', Validators.required],
  });
  coins: Coin[];
  address: string;
  operationsList: FiatRampOperation[];

  constructor(
    private formBuilder: FormBuilder,
    private browserService: BrowserService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private walletEncryptionService: WalletEncryptionService,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private apiWalletService: ApiWalletService,
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.subscribeToFormChanges();
    this.initAssetsForm();
    this.getOperations();
  }

  getOperations() {
    this.fiatRampsService.getUserOperations().subscribe((data) => {
      this.operationsList = data.map((operation) =>
        FiatRampOperation.create(operation, this.apiWalletService, this.fiatRampsService)
      );
    });
  }

  initAssetsForm() {
    const initialAsset = this.route.snapshot.paramMap.get('asset');
    this.storageService.getAssestsSelected().then((coins) => {
      this.coins = coins.filter((coin) => Boolean(coin.moonpayCode));
      if (initialAsset) {
        this.form.patchValue({ currency: this.coins.find((coin) => coin.value === initialAsset) });
      } else {
        this.form.patchValue({ currency: this.coins[0] });
      }
    });
  }

  subscribeToFormChanges() {
    this.form.get('currency').valueChanges.subscribe((value) => {
      this.getAddress(value);
    });
  }

  getAddress(currency: Coin) {
    this.walletEncryptionService.getEncryptedWallet().then((wallet) => {
      const network = this.coins.find((coin) => coin.value === currency.value).network;
      this.address = wallet.addresses[network];
    });
  }

  async openMoonpay() {
    this.fiatRampsService
      .getMoonpayLink(this.address, this.form.value.currency.moonpayCode)
      .toPromise()
      .then(async (link) => {
        this.success().then(() => {
          this.browserService.open(link);
        });
      });
  }

  success(): Promise<boolean> {
    return this.navController.navigateForward(['/tabs/wallets']);
  }

  async goToMoonpay() {
    await this.browserService.open({ url: 'https://buy.moonpay.com/trade_history' });
  }
}
