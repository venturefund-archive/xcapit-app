import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { COINS } from '../../constants/coins';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { UX_ALERT_TYPES } from 'src/app/shared/components/ux-alert-message/ux-alert-types';

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

      <app-ux-alert-message [type]="this.alertType">
        <div>
          <ion-text>Titulo</ion-text>
        </div>
        <div>
          <ion-text>Texto</ion-text>
        </div>
      </app-ux-alert-message>

      <div class="sd__submit-button">
        <ion-button
          class="ux_button sd__submit-button__button"
          appTrackClick
          name="Continue"
          (click)="this.goToSummary()"
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
    private transactionDataService: TransactionDataService
  ) {}

  ionViewWillEnter() {
    this.getCurrency();
    this.setCurrencyNetworks();
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

  async goToSummary() {
    if (this.form.valid) {
      this.transactionDataService.transactionData = {
        network: this.selectedNetwork,
        currency: this.currency,
        ...this.form.value,
      };
      await this.navController.navigateForward(['/wallets/send/summary']);
    }
  }
}
