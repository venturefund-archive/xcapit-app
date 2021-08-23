import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { COINS } from '../../constants/coins';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';

@Component({
  selector: 'app-send-detail',
  template: `
    <ion-header>
      <!--    <ion-header [style.visibility]="this.scanActive ? 'hidden' : 'visible'"> -->
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/select-currency"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.send.send_detail.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="sd ion-padding-start ion-padding-end">
      <!--      [style.visibility]="this.scanActive ? 'hidden' : 'visible'"-->
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

      <div class="sd__network-select-card">
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
      <div class="sd__address-input-card">
        <app-address-input-card
          (scanActiveChange)="this.scanActiveChange($event)"
          [title]="'Billetera destino' | translate"
          [helpText]="'Direccion o alias' | translate"
        ></app-address-input-card>
      </div>
      <div class="sd__amount-to-send-card">amount-to-send-card</div>
    </ion-content>
  `,
  styleUrls: ['./send-detail.page.scss'],
})
export class SendDetailPage {
  currency: Coin;
  networks = ['ERC20'];
  selectedNetwork: string = this.networks[0];
  scanActive = false;

  constructor(private route: ActivatedRoute) {}

  ionViewWillEnter() {
    this.currency = COINS.find((c) => c.value === this.route.snapshot.paramMap.get('currency'));
  }

  selectedNetworkChanged(network) {
    this.selectedNetwork = network;
  }

  scanActiveChange(active: boolean) {
    this.scanActive = active;
  }
}
