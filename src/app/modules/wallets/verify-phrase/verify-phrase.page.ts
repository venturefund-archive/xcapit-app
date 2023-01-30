import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Mnemonic } from '@ethersproject/hdnode';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { RecoveryPhraseCardComponent } from '../shared-wallets/components/recovery-phrase-card/recovery-phrase-card.component';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WalletBackupService } from '../shared-wallets/services/wallet-backup/wallet-backup.service';
@Component({
  selector: 'app-verify-phrase',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded ux_toolbar__left">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/recovery/read"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wallets.verify_phrase.header' | translate }}</ion-title>
        <ion-label class="ux_toolbar__step" slot="end">2 {{ 'shared.step_counter.of' | translate }} 2</ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content">
          <div class="title">
            <ion-text class="ux-font-text-lg">{{ 'wallets.verify_phrase.title' | translate }}</ion-text>
          </div>
          <div class="description">
            <ion-text>
              {{ 'wallets.verify_phrase.description' | translate }}
            </ion-text>
          </div>
          <swiper class="verify-phrase-page-swiper" *ngIf="this.wordsToVerify.length > 0" #swiper [config]="config">
            <ng-template class="template" swiperSlide *ngFor="let word of this.wordsToVerify; let i = index">
              <ion-card class="input-phrase__card">
                <div class="input-phrase__card__input">
                  <div class="input-phrase__card__input__hidden" *ngIf="!word.value"></div>
                  <ion-button
                    class="input-word ux-font-text-xxs"
                    [id]="i"
                    [ngClass]="{ active: word.value}"
                    size="small"
                    name="Remove Word"
                    fill="clear"
                    *ngIf="word.value"
                    (click)="this.deleteWord(i)"
                    >{{ word.value }}
                    <ion-icon name="ux-error-circle-outline" slot="end"></ion-icon>
                  </ion-button>
                </div>
                <ion-label class="input-phrase__card__label"
                  >{{ 'wallets.verify_phrase.word_counter' | translate }}{{ word.order }}</ion-label
                >
              </ion-card>
              <div class="dot"></div>
            </ng-template>
          </swiper>
          <div class="recovery-phrase-wrapper" *ngIf="this.phrase">
            <app-recovery-phrase-card
              [centered]="true"
              [phrase]="this.phrase"
              [ordered]="true"
              [clickable]="!this.allWordsSelected"
              [showOrder]="false"
              [showBackupMessage]="false"
              (useButtonClicked)="this.addWord($event)"
            ></app-recovery-phrase-card>
          </div>
        </div>
        <div class="ux_footer">
          <ion-button
            color="secondary"
            class="ux_button"
            appTrackClick
            name="ux_protect_finalize"
            (click)="this.verifyWallet()"
            [appLoading]="this.loading"
            [loadingText]="'wallets.verify_phrase.verifying' | translate"
            [disabled]="!this.allWordsSelected"
          >
            {{ 'wallets.verify_phrase.btn_create' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./verify-phrase.page.scss'],
})
export class VerifyPhrasePage implements OnInit {
  @ViewChild(RecoveryPhraseCardComponent) recoveryPhraseComponent: RecoveryPhraseCardComponent;
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  allWordsSelected = false;
  ordered = true;
  verificationPhrase: string[] = [];
  phrase: string[];
  mnemonic: Mnemonic;
  loading = false;
  wordsToVerify = [];
  public config: SwiperOptions = {
    allowSlideNext: false,
    allowSlidePrev: false,
    navigation: false,
    slidesPerView: 2,
    centeredSlides: true,
  };
  profileTestComplete: boolean;
  key = 'profileTestCompleted';

  constructor(
    private navController: NavController,
    private walletMnemonicService: WalletMnemonicService,
    private ionicStorageService: IonicStorageService,
    private walletBackupService: WalletBackupService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.mnemonic = this.walletMnemonicService.getMnemonic();
    this.phrase = this.mnemonic.phrase.split(' ');
    this.selectWordsToVerify();
    this.getProfileStatus();
  }

  getProfileStatus() {
    this.ionicStorageService.get(this.key).then((value: boolean) => (this.profileTestComplete = value));
  }

  selectWordsToVerify() {
    let i = 1;
    while (i <= 3) {
      const wordOrder = Math.floor(Math.random() * 12) + 1;
      if (!this.wordsToVerify.some((word) => word.order === wordOrder)) {
        this.addWordToVerify(wordOrder);
        i++;
      }
    }
    this.orderWordsToVerify();
  }

  addWordToVerify(wordOrder: number) {
    this.wordsToVerify.push({
      order: wordOrder,
      value: null,
    });
  }

  orderWordsToVerify() {
    this.wordsToVerify.sort((a, b) => (a.order > b.order ? 1 : b.order > a.order ? -1 : 0));
  }

  swipeNext() {
    this.swiper.swiperRef.allowSlideNext = true;
    this.swiper.swiperRef.slideNext();
    this.swiper.swiperRef.allowSlideNext = false;
  }

  swipePrev() {
    this.swiper.swiperRef.allowSlidePrev = true;
    this.swiper.swiperRef.slidePrev();
    this.swiper.swiperRef.allowSlidePrev = false;
  }

  updateWordToDoVerify(word = null) {
    this.wordsToVerify.map((w, index) => {
      if (index === this.verificationPhrase.length) {
        w.value = word;
      }
    });
  }

  addWord(word: string) {
    this.updateWordToDoVerify(word);
    this.verificationPhrase.push(word);
    this.swipeNext();
    this.allWordsSelected = this.checkAllWordsSelected();
  }

  validPhrase(): boolean {
    return this.wordsToVerify.every((w) => this.phrase[w.order - 1] === w.value);
  }

  async deleteWord(index: number) {
    const word = this.verificationPhrase[index];
    const activeIndex = this.getActiveIndex();
    if (activeIndex - 1 === index && word) {
      this.verificationPhrase.pop();
      this.updateWordToDoVerify();
      if (this.verificationPhrase.length !== this.wordsToVerify.length - 1) {
        this.swipePrev();
      }
      this.recoveryPhraseComponent.enable(word);
      this.allWordsSelected = this.checkAllWordsSelected();
    }
  }

  checkAllWordsSelected(){
    return this.verificationPhrase.length === 3
  }

  verifyWallet() {
    this.loading = true;
    if (this.validPhrase()) {
      this.loading = true;
      this.ionicStorageService
        .set('protectedWallet', true)
        .then(() => this.walletBackupService.disableModal())
        .then(() => this.navigateToPage())
        .finally(() => (this.loading = false));
    } else {
      this.navController.navigateForward(['/wallets/failed-mnemonic']);
    }
  }

  navigateToPage(){
    this.profileTestComplete
        ? this.navController.navigateForward(['/tabs/wallets'])
        : this.navController.navigateForward(['/profiles/profile-test']);
  }

  getActiveIndex() {
    return this.verificationPhrase.length;
  }

  clearMnemonic() {
    this.walletMnemonicService.clearMnemonic();
  }

  ionViewWillLeave(){
    this.clearMnemonic();
  }
}
