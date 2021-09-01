import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallets-subheader',
  template: `
    <div class="wsc">
      <div class="wsc ion-padding">
        <div class="ux-font-text-xs wsc__title">
          <ion-text>{{
            (this.walletExist
              ? 'wallets.home.subheader_component.title_with_wallet'
              : 'wallets.home.subheader_component.title_without_wallet'
            ) | translate
          }}</ion-text>
        </div>
        <div class="wsc__img">
          <img src="assets/img/fund-list/start-invest.svg" alt="Start invest" />
        </div>
        <div class="wsc__card-buttons" *ngIf="this.walletExist">
          <div class="wsc__card-buttons__receive-card">
            <app-icon-button-card
              (click)="this.goToReceive()"
              appTrackClick
              name="Go to Receive"
              [text]="'wallets.home.subheader_component.receive_card' | translate"
              icon="ux-money-flow"
            ></app-icon-button-card>
          </div>
          <div class="wsc__card-buttons__buy-card">
            <app-icon-button-card
              (click)="this.goToBuy()"
              appTrackClick
              name="Go to Buy"
              [text]="'wallets.home.subheader_component.buy_card' | translate"
              icon="ux-buy-sell"
            ></app-icon-button-card>
          </div>
        </div>
        <div class="wsc__buttons" *ngIf="!this.walletExist">
          <ion-button
            appTrackClick
            name="Create Wallet"
            class="ux_button"
            type="button"
            color="uxsecondary"
            expand="block"
            size="medium"
            (click)="this.createWallet()"
          >
            {{ 'wallets.home.subheader_component.create_wallet_button' | translate }}
          </ion-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./wallets-subheader.component.scss'],
})
export class WalletsSubheaderComponent implements OnInit {
  @Input() walletExist: boolean;
  constructor(private navController: NavController) {}

  ngOnInit() {}

  createWallet() {
    this.navController.navigateForward(['wallets/create-first/disclaimer']);
  }
  goToReceive() {
    this.navController.navigateForward(['wallets/receive']);
  }
  goToBuy() {
    this.navController.navigateForward('/fiat-ramps/operations');
  }
}
