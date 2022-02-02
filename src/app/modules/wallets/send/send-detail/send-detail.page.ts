import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { UX_ALERT_TYPES } from 'src/app/shared/components/ux-alert-message/ux-alert-types';
import { WalletService } from '../../shared-wallets/services/wallet/wallet.service';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { ApiWalletService } from '../../shared-wallets/services/api-wallet/api-wallet.service';
import { debounceTime } from "rxjs/operators";
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
        <ion-text class="ux-font-text-lg">
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
          selectorStyle="classic"
          [selectedNetwork]="this.selectedNetwork"
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
          <app-send-amount-input-card
            [title]="'wallets.send.send_detail.amount_input.title' | translate"
            [currencyName]="this.currency.value"
            [nativeTokenName]="this.nativeToken.value"
            referenceCurrencyName="USD"
          ></app-send-amount-input-card>
        </div>
      </form>

      <div class="sd__alert" *ngIf="!!this.nativeToken && this.balanceNativeToken === 0">
        <app-ux-alert-message [type]="this.alertType">
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
          color="uxsecondary"
          >{{ 'wallets.send.send_detail.continue_button' | translate }}</ion-button
        >
      </div>
    </ion-content>
  `,
  styleUrls: ['./send-detail.page.scss'],
})
export class SendDetailPage {
  alertType = UX_ALERT_TYPES.warning;
  currency: Coin;
  networks: string[];
  selectedNetwork: string;
  nativeToken: Coin;
  balanceNativeToken: number;
  balance: number;
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
    private apiWalletService: ApiWalletService,
  ) {}

  ionViewWillEnter() {
    this.form.get('amount').valueChanges
      .pipe(debounceTime(250))
      .subscribe(() => this.updateTransactionData() );

    this.getCurrency();
    this.setCurrencyNetworks();
    this.checkTokensAmounts();
    this.updateTransactionData();
  }

  private getNativeToken() {
    this.nativeToken = this.apiWalletService.getNativeTokenFromNetwork(this.selectedNetwork);
  }

  checkTokensAmounts() {
    this.getNativeToken();
    this.storageService.getWalletsAddresses(this.selectedNetwork).then((nativeTokenAddress) => {
      this.walletService.balanceOf(nativeTokenAddress, this.nativeToken.value).then((balance) => {
        this.balanceNativeToken = parseFloat(balance);
      });
      this.walletService.balanceOf(nativeTokenAddress, this.currency.value).then((balance) => {
        this.balance = parseFloat(balance);
      });
    });
  }

  private getCurrency() {
    this.currency = this.apiWalletService.getCoin(this.route.snapshot.paramMap.get('currency'), this.selectedNetwork);
  }

  private setCurrencyNetworks() {
    this.networks = [this.currency.network];

    this.selectedNetworkChanged(this.networks[0]);
  }

  selectedNetworkChanged(network) {
    this.selectedNetwork = network;
  }

  async submitForm() {
    if (this.form.valid) {
      await this.goToSummary();
    }
  }

  async goToSummary() {
    this.updateTransactionData();
    await this.navController.navigateForward(['/wallets/send/summary']);
  }

  private updateTransactionData() {
    this.transactionDataService.transactionData = {
      network: this.selectedNetwork,
      currency: this.currency,
      ...this.form.value,
      balanceNativeToken: this.balanceNativeToken,
      balance: this.balance,
    };
  }
}
