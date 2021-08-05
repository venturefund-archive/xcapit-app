import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallets-subheader',
  template: `
    <div class="wsc">
      <div class="wsc ion-padding">
        <div class="ux-font-roboto ux-fweight-extrabold ux-fsize-14 wsc__title">
          <ion-text>{{ 'wallets.home.subheader_component.title' | translate }}</ion-text>
        </div>
        <div class="wsc__img">
          <img src="assets/img/fund-list/start-invest.svg" alt="Start invest" />
        </div>
        <div class="wsc__buttons">
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
  constructor(private navController: NavController) {}

  ngOnInit() {}

  createWallet() {
    this.navController.navigateBack(['/tabs/funds']);
  }
}
