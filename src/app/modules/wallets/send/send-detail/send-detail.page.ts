import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { COINS } from '../../constants/coins';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { AlertController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { UX_ALERT_TYPES } from 'src/app/shared/components/ux-alert-message/ux-alert-types';
import { WalletService } from '../../shared-wallets/services/wallet/wallet.service';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { BigNumber } from 'ethers';
import { BlockchainProviderService } from '../../shared-wallets/services/brockchain-provider/blockchain-provider.service';
import { TranslateService } from '@ngx-translate/core';
import { WalletTransactionsService } from '../../shared-wallets/services/wallet-transactions/wallet-transactions.service';

@Component({
  selector: 'app-send-detail',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/select-currency"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.send.send_detail.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="sd ion-padding-start ion-padding-end">
      <div class="sd__title">
        <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-24">
          {{ 'wallets.send.send_detail.title' | translate }}
        </ion-text>
      </div>

      <div class="sd__selected-currency" *ngIf="this.currency">
        <div class="sd__selected-currency__text">
          <ion-text>{{ this.currency.name }}</ion-text>
        </div>
        <div class="sd__selected-currency__icon">
          <img [src]="this.currency.logoRoute" alt="icon" />
        </div>
      </div>

      <div class="sd__network-select-card" *ngIf="this.networks">
        <app-network-select-card
          (networkChanged)="this.selectedNetworkChanged($event)"
          [title]="'wallets.send.send_detail.network_select.title' | translate"
          [networks]="this.networks"
          [disclaimer]="
            'wallets.send.send_detail.network_select.disclaimer'
              | translate
                : {
                    network: this.selectedNetwork
                  }
          "
        ></app-network-select-card>
      </div>

      <form [formGroup]="this.form">
        <div class="sd__address-input-card" *ngIf="this.currency">
          <app-address-input-card
            [title]="'wallets.send.send_detail.address_input.title' | translate"
            [helpText]="
              'wallets.send.send_detail.address_input.help_text' | translate: { currency: this.currency.value }
            "
          ></app-address-input-card>
        </div>
        <div class="sd__amount-input-card" *ngIf="this.currency">
          <app-amount-input-card
            [title]="'wallets.send.send_detail.amount_input.title' | translate"
            [currencyName]="this.currency.value"
            referenceCurrencyName="USD"
          ></app-amount-input-card>
        </div>
      </form>

      <div class="sd__alert">
        <app-ux-alert-message [type]="this.alertType" *ngIf="!this.hasNativeToken">
          <div class="sd__alert__title">
            <ion-text>{{ 'wallets.send.send_detail.alert.title' | translate }}</ion-text>
          </div>
          <div class="sd__alert__text">
            <ion-text>{{
              'wallets.send.send_detail.alert.text' | translate: { nativeToken: this.nativeToken.value }
            }}</ion-text>
          </div>
        </app-ux-alert-message>
      </div>

      <div class="sd__submit-button">
        <ion-button
          class="ux_button sd__submit-button__button"
          appTrackClick
          name="Continue"
          (click)="this.submitForm()"
          [disabled]="!this.form.valid || !this.selectedNetwork"
          >{{ 'wallets.send.send_detail.continue_button' | translate }}</ion-button
        >
      </div>
    </ion-content>
  `,
  styleUrls: ['./send-detail.page.scss'],
})
export class SendDetailPage {
  alertType = UX_ALERT_TYPES.warning;
  coins = COINS;
  currency: Coin;
  networks: string[];
  selectedNetwork: string;
  estimatedGas: BigNumber;
  hasNativeToken = true;
  nativeToken: Coin;
  balanceNativeToken: number;
  amount: number;
  form: FormGroup = this.formBuilder.group({
    address: ['', [Validators.required]],
    amount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    referenceAmount: ['', [Validators.required]],
  });

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private transactionDataService: TransactionDataService,
    private walletService: WalletService,
    private storageService: StorageService,
    private blockchainProviderService: BlockchainProviderService,
    private walletTransactionService: WalletTransactionsService,
    private alertController: AlertController,
    private translate: TranslateService
  ) {}

  ionViewWillEnter() {
    this.getCurrency();
    this.setCurrencyNetworks();
    this.checkNativeTokenAmount();
  }

  getNativeToken() {
    this.nativeToken = this.coins.find((c) => c.network === this.selectedNetwork && c.native);
  }

  async checkNativeTokenAmount() {
    this.getNativeToken();
    const nativeTokenAddress = await this.storageService.getWalletsAddresses(this.selectedNetwork);
    this.balanceNativeToken = parseFloat(
      await this.walletService.balanceOf(nativeTokenAddress, this.nativeToken.value)
    );
    this.hasNativeToken = this.balanceNativeToken > 0;
  }

  async canAffordFee() {
    if (
      await this.walletTransactionService.canNotAffordFee(
        this.currency,
        this.balanceNativeToken,
        parseFloat(this.form.value.amount),
        this.form.value.address
      )
    ) {
      this.showAlertNotEnoughNativeToken();
    } else {
      this.goToSummary();
    }
  }

  async showAlertNotEnoughNativeToken() {
    const alert = await this.alertController.create({
      header: this.translate.instant('wallets.send.send_summary.alert_not_enough_native_token.title'),
      message: this.translate.instant('wallets.send.send_summary.alert_not_enough_native_token.text'),
      cssClass: 'ux-wallet-error-alert ux-alert',
      buttons: [
        {
          text: this.translate.instant('wallets.send.send_summary.alert_not_enough_native_token.button'),
          cssClass: 'uxprimary',
        },
      ],
    });
    await alert.present();
  }

  private getCurrency() {
    this.currency = this.coins.find((c) => c.value === this.route.snapshot.paramMap.get('currency'));
  }

  private setCurrencyNetworks() {
    this.networks = [this.currency.network];
    this.selectedNetwork = this.currency.network;
  }

  selectedNetworkChanged(network) {
    this.selectedNetwork = network;
  }

  async submitForm() {
    if (this.form.valid) {
      await this.canAffordFee();
    }
  }

  async goToSummary() {
    this.transactionDataService.transactionData = {
      network: this.selectedNetwork,
      currency: this.currency,
      ...this.form.value,
    };
    await this.navController.navigateForward(['/wallets/send/summary']);
  }
}
