import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { Mnemonic } from '@ethersproject/hdnode';

@Component({
  selector: 'app-recovery-phrase',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wallets.recovery_phrase.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div name="Content" class="ux-content">
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
        <div *ngIf="this.mnemonic">
          <app-recovery-phrase-card
            [phrase]="this.mnemonic.phrase.split(' ')"
            [showOrder]="true"
          ></app-recovery-phrase-card>
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
    this.walletMnemonicService.mnemonic = this.mnemonic;
    this.navController.navigateForward(['/wallets/create-first/verify-phrase']);
  }
}
