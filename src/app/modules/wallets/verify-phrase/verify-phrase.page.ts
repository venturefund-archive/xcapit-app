import { Component, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { Mnemonic } from '@ethersproject/hdnode';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { RecoveryPhraseCardComponent } from '../shared-wallets/components/recovery-phrase-card/recovery-phrase-card.component';
@Component({
  selector: 'app-verify-phrase',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/create-first/recovery-phrase"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.verify_phrase.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div name="Content" class="ux-content">
        <div class="title">
          <ion-text class="ux-font-text-xl">{{ 'wallets.verify_phrase.title' | translate }}</ion-text>
        </div>
        <ion-slides [options]="options">
          <ion-slide class="slide" *ngFor="let word of this.phrase; let i = index">
            <ion-card>
              <div class="div-input">
                <ion-button
                  class="input-word"
                  [id]="i"
                  [ngClass]="{ active: this.verificationPhrase[i] }"
                  size="small"
                  fill="clear"
                  (click)="this.deleteWord(i)"
                  >{{ this.verificationPhrase[i] }}
                  <ion-icon name="close" slot="end"></ion-icon>
                </ion-button>
              </div>
              <ion-label class="label-card">{{ i + 1 + '/' + this.countWords }}</ion-label>
            </ion-card>
          </ion-slide>
        </ion-slides>
        <div class="text1">
          <ion-text class="text1 ux-font-text-base">{{ 'wallets.verify_phrase.text1' | translate }}</ion-text>
        </div>
        <div *ngIf="this.phrase">
          <app-recovery-phrase-card
            [phrase]="this.phrase"
            [ordered]="true"
            [clickable]="true"
            [showOrder]="false"
            (useButtonClicked)="this.addWord($event)"
          ></app-recovery-phrase-card>
        </div>
        <div class="create_button">
          <ion-button
            color="uxsecondary"
            *ngIf="this.activated"
            class="ux_button"
            appTrackClick
            name="Create Wallet"
            (click)="this.createWallet()"
          >
            {{ 'wallets.verify_phrase.btn_create' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./verify-phrase.page.scss'],
})
export class VerifyPhrasePage {
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(RecoveryPhraseCardComponent) recoveryPhraseComponent: RecoveryPhraseCardComponent;
  options = {
    slidesPerView: 2,
    spaceBetween: -30,
  };
  activated = false;
  ordered = true;
  verificationPhrase: string[] = [];
  phrase: string[];
  countWords: number;
  mnemonic: Mnemonic;
  slide = 0;

  constructor(
    private navController: NavController,
    private walletMnemonicService: WalletMnemonicService,
    private walletService: WalletService
  ) {}

  ionViewWillEnter() {
    this.mnemonic = this.walletMnemonicService.mnemonic;
    this.phrase = this.mnemonic.phrase.split(' ');
    this.countWords = this.phrase.length;
    this.blockNextSlide(true);
    this.blockPrevSlide(true);
  }

  swipeNext() {
    if (this.slide > 1) {
      this.blockNextSlide(false);
      this.slides.slideNext();
      this.blockNextSlide(true);
      this.blockPrevSlide(true);
    }
  }

  blockNextSlide(state: boolean) {
    return this.slides.lockSwipeToNext(state);
  }

  blockPrevSlide(state: boolean) {
    return this.slides.lockSwipeToPrev(state);
  }

  addWord(word: string) {
    this.verificationPhrase.push(word);
    this.slide++;
    this.swipeNext();
    this.activated = this.verificationPhrase.length === this.countWords;
  }

  validPhrase(): boolean {
    return JSON.stringify(this.verificationPhrase) === JSON.stringify(this.phrase);
  }

  async deleteWord(index: number) {
    const word = this.verificationPhrase[index];
    const activeIndex = this.getActiveIndex();

    if (activeIndex - 1 === index && word) {
      this.verificationPhrase.pop();
      this.blockPrevSlide(false);
      this.slides.slidePrev();
      this.blockPrevSlide(true);
      this.recoveryPhraseComponent.enable(word);
      this.slide--;
      this.activated = this.verificationPhrase.length === this.countWords;
    }
  }

  createWallet() {
    if (this.validPhrase()) {
      this.walletService.create();
      this.navController.navigateForward(['/wallets/create-password']);
    } else {
      this.navController.navigateForward(['/wallets/failed-mnemonic']);
    }
  }

  getActiveIndex() {
    return this.verificationPhrase.length;
  }
}
