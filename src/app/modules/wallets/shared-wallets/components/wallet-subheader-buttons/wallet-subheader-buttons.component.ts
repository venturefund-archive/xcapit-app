import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-wallet-subheader-buttons',
  template: `
    <div class="wsb">
      <div class="wsb__card-buttons">
        <div class="wsb__card-buttons__send-card card">
          <app-icon-button-card
            (click)="this.goToSend()"
            appTrackClick
            name="ux_send_go_to_send"
            [text]="'wallets.home.subheader_buttons_component.send_card' | translate"
            icon="ux-arrow-up"
          ></app-icon-button-card>
        </div>
        <div class="wsb__card-buttons__receive-card card">
          <app-icon-button-card
            (click)="this.goToReceive()"
            appTrackClick
            name="Go to Receive"
            [text]="'wallets.home.subheader_buttons_component.receive_card' | translate"
            icon="ux-arrow-down"
          ></app-icon-button-card>
        </div>
        <div class="wsb__card-buttons__buy-card card">
          <app-icon-button-card
            (click)="this.goToBuy()"
            appTrackClick
            name="Go to Buy"
            [text]="'wallets.home.subheader_buttons_component.buy_card' | translate"
            icon="ux-currency"
          ></app-icon-button-card>
        </div>
        <div class="wsb__card-buttons__performance card">
          <app-icon-button-card
            (click)="this.goToPerformance()"
            appTrackClick
            name="Go to Performance"
            [text]="'wallets.home.subheader_buttons_component.performance_card' | translate"
            icon="ux-home-trending"
          ></app-icon-button-card>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./wallet-subheader-buttons.component.scss'],
})
export class WalletSubheaderButtonsComponent implements OnInit {
  @Input() asset: string;
  @Input() network: string;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToSend() {
    if (!this.asset) {
      return this.navController.navigateForward(['wallets/send/select-currency']);
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: this.asset,
        network: this.network,
      },
    };
    return this.navController.navigateForward(['wallets/send/detail'], navigationExtras);
  }

  goToReceive() {
    if (!this.asset) {
      return this.navController.navigateForward(['wallets/receive/select-currency']);
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: this.asset,
        network: this.network,
      },
    };

    return this.navController.navigateForward(['wallets/receive/detail'], navigationExtras);
  }

  goToBuy() {
    this.navController.navigateForward(['fiat-ramps/moonpay']);
  }

  goToPerformance() {
    this.navController.navigateForward(['tabs/investments/defi']);
  }
}
