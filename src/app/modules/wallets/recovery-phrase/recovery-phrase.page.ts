import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { Mnemonic } from '@ethersproject/hdnode';

@Component({
  selector: 'app-recovery-phrase',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wallets.recovery_phrase.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ux_main">
        <div name="Content" class="ux_content">
          <div class="title">
            <ion-text class="ux-font-text-xl">{{ 'wallets.recovery_phrase.title' | translate }}</ion-text>
          </div>
          <div class="text">
            <ion-text class="ux-font-text-base">{{ 'wallets.recovery_phrase.text1' | translate }}</ion-text>
          </div>
          <div class="text">
            <ion-text class="ux-font-text-base">{{ 'wallets.recovery_phrase.text2' | translate }}</ion-text>
          </div>
          <div class="text">
            <ion-text class="ux-font-text-base">{{ 'wallets.recovery_phrase.text3' | translate }}</ion-text>
          </div>
          <div class="text">
            <ion-text class="ux-font-text-base">{{ 'wallets.recovery_phrase.text4' | translate }}</ion-text>
          </div>
          <div class="component" *ngIf="this.mnemonic">
            <app-recovery-phrase-card
              [phrase]="this.mnemonic.phrase.split(' ')"
              [showOrder]="true"
            ></app-recovery-phrase-card>
          </div>
        </div>
        <div class="ux_footer">
          <div class="next_button">
            <ion-button
              class="ux_button"
              color="secondary"
              appTrackClick
              name="ux_create_next_words"
              size="large"
              (click)="goToVerifyPhrase()"
            >
              {{ 'wallets.recovery_phrase.btn_next' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./recovery-phrase.page.scss'],
})
export class RecoveryPhrasePage implements OnInit {
  mnemonic: Mnemonic;
  constructor(private navController: NavController, private walletMnemonicService: WalletMnemonicService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.mnemonic = this.walletMnemonicService.newMnemonic();
  }

  goToVerifyPhrase() {
    this.walletMnemonicService.mnemonic =  this.mnemonic;
    this.navController.navigateForward(['/wallets/create-first/verify-phrase']);
  }
}
