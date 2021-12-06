import { Component, OnInit } from '@angular/core';
import { WALLET_TERMS_OPTIONS } from '../shared-support/constants/wallet-terms-options';

@Component({
  selector: 'app-wallet-terms-options',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/support/options"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'support.wallet-terms-options.title' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="ux_content">
          <div>
            <ion-list *ngIf="this.options">
              <app-support-options-card *ngFor="let option of options" [option]="option"> </app-support-options-card>
            </ion-list>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./wallet-terms-options.page.scss'],
})
export class WalletTermsOptionsPage implements OnInit {
  options = WALLET_TERMS_OPTIONS;
  constructor() {}

  ngOnInit() {}
}
