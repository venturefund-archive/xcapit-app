import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallets-subheader',
  template: `
    <div class="wsc">
      <div class="ion-padding">
        <div class="ux-font-text-xs wsc__title">
          <ion-text>
            {{ 'wallets.home.subheader_component.title_without_wallet' | translate }}
          </ion-text>
        </div>
        <div class="wsc__img">
          <img src="assets/img/wallets/create-wallet.svg" alt="Start invest" />
        </div>
        <div class="wsc__buttons">
          <ion-button
            appTrackClick
            name="ux_create_create_wallet"
            class="ux_button"
            type="button"
            color="secondary"
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
  constructor(private navController: NavController) {}

  ngOnInit() {}

  createWallet() {
    this.navController.navigateForward(['wallets/create-first/disclaimer']);
  }
}
