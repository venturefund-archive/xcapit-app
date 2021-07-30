import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, IonSlides, NavController } from '@ionic/angular';

@Component({
  selector: 'app-verify-phrase',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/create-first/recovery-phrase"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.verify-phrase.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div name="Content" class="ux-content">
        <div class="title">
          <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">{{
            'wallets.verify-phrase.title' | translate
          }}</ion-text>
        </div>
        <div>
          <ion-slides spaceBetween="40" slidesPerView="2" (ionSlideWillChange)="this.view()">
            <ion-slide class="slide" *ngFor="let word of this.words; let indice = index">
              <ion-card>
                <div class="div-input">
                  <ion-button class="input-word" [ngClass]="{ active: wordInput }" size="small" fill="clear"
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
            *ngIf="!this.activated"
            class="ux_button"
            appTrackClick
            name="Create Wallet"
            type="submit"
            (click)="this.verifyPhrase()"
          >
            {{ 'wallets.verify-phrase.btn_create' | translate }}
          </ion-button>
        </div>
        <div class="text1">
          <ion-text class="text1 ux-font-lato ux-fweight-semibold ux-fsize-15">{{
            'wallets.verify-phrase.text1' | translate
          }}</ion-text>
        </div>
        <app-verify-phrase-card (useButtonClicked)="this.wordValor($event)" class="card"></app-verify-phrase-card>
      </div>
    </ion-content>
  `,
  styleUrls: ['./verify-phrase.page.scss'],
})
export class VerifyPhrasePage implements OnInit {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  activated = true;
  ordered = true;
  inputWords: string[] = [];
  wordInput = false;
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

  ngOnInit() {
    this.slides.lockSwipeToNext(true);
    this.slides.lockSwipeToPrev(true);
  }

  swipeNext() {
    this.slides.lockSwipeToNext(false);
    this.slides.slideNext();
    this.slides.lockSwipeToNext(true);
    this.slides.lockSwipeToPrev(true);
  }

  wordValor(word: string) {
    this.inputWords.push(word);
    this.wordInput = true;
    setTimeout(() => {
      this.swipeNext();
    }, 800);
    if (this.inputWords.length === this.countWords) {
      this.activated = !this.activated;
    }
  }

  verifyPhrase() {
    let equalsWords = 0;
    if (this.words.length === this.inputWords.length) {
      for (let i = 0; i < this.inputWords.length; i++) {
        if (this.inputWords[i] === this.words[i]) {
          equalsWords++;
        }
      }
    }
    if (equalsWords === this.inputWords.length) {
      this.navController.navigateForward(['/wallets/success-creation']);
    }
  }

  view() {
    setTimeout(() => {
      this.wordInput = false;
    }, 77);
  }
}
