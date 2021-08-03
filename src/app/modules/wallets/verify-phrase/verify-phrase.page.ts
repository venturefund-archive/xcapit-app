import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
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
          <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">{{
            'wallets.verify_phrase.title' | translate
          }}</ion-text>
        </div>
        <div>
          <ion-slides [options]="options">
            <ion-slide class="slide" *ngFor="let word of this.words; let indice = index">
              <ion-card>
                <div class="div-input">
                  <ion-button
                    class="input-word"
                    [ngClass]="{ active: true ? this.inputWords[indice] : '' }"
                    size="small"
                    fill="clear"
                    >{{ this.inputWords[indice] }}
                  </ion-button>
                </div>
                <ion-label class="label-card">{{ indice + 1 + '/' + this.countWords }}</ion-label>
              </ion-card>
            </ion-slide>
          </ion-slides>
        </div>
        <div class="create_button">
          <ion-button
            *ngIf="this.activated"
            class="ux_button"
            appTrackClick
            name="Create Wallet"
            (click)="this.verifyPhrase()"
          >
            {{ 'wallets.verify_phrase.btn_create' | translate }}
          </ion-button>
        </div>
        <div class="text1">
          <ion-text class="text1 ux-font-lato ux-fweight-semibold ux-fsize-15">{{
            'wallets.verify_phrase.text1' | translate
          }}</ion-text>
        </div>
        <app-recovery-phrase-card
          [ordered]="true"
          [clickable]="true"
          [showOrder]="false"
          (useButtonClicked)="this.wordValue($event)"
          class="card"
        ></app-recovery-phrase-card>
      </div>
    </ion-content>
  `,
  styleUrls: ['./verify-phrase.page.scss'],
})
export class VerifyPhrasePage {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  options = {
    slidesPerView: 1.8,
    centeredSlides: true,
    spaceBetween: -30,
  };
  activated = false;
  ordered = true;
  inputWords: string[] = [];
  words: string[] = [
    'insecto',
    'puerta',
    'vestido',
    'piso',
    'plato',
    'nube',
    'afuera',
    'fuego',
    'laptop',
    'libre',
    'perro',
    'niño',
  ];
  countWords = this.words.length;

  constructor(private navController: NavController) {}

  ionViewWillEnter() {
    this.blockNextSlide(true);
    this.blockPrevSlide(true);
  }

  swipeNext() {
    this.blockNextSlide(false);
    this.slides.slideNext();
    this.blockNextSlide(true);
    this.blockPrevSlide(true);
  }

  blockNextSlide(state: boolean) {
    return this.slides.lockSwipeToNext(state);
  }

  blockPrevSlide(state: boolean) {
    return this.slides.lockSwipeToPrev(state);
  }

  wordValue(word: string) {
    this.inputWords.push(word);
    setTimeout(() => {
      this.swipeNext();
    }, 800);
    if (this.inputWords.length === this.countWords) {
      this.activated = !this.activated;
    }
  }

  verifyPhrase() {
    if (JSON.stringify(this.inputWords) === JSON.stringify(this.words)) {
      this.navController.navigateForward(['/wallets/success-creation']);
    }
  }
}
