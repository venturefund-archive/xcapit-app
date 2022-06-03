import { Component, OnInit, ViewChild } from '@angular/core';
import { Mnemonic } from '@ethersproject/hdnode';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { IonAccordionGroup, ModalController, NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WalletPasswordComponent } from '../shared-wallets/components/wallet-password/wallet-password.component';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';

@Component({
  selector: 'app-recovery-phrase-read',
  template: `
    <ion-header>
      <ion-toolbar
        [class.ux_toolbar__left]="!this.protectedWallet"
        [class.ux_toolbar_xs]="this.protectedWallet"
        color="primary"
        class="ux_toolbar"
      >
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/recovery/info"></ion-back-button>
        </ion-buttons>
        <ion-title class="ux-font-text-lg">
          {{
            (this.protectedWallet
              ? 'wallets.recovery_phrase_read.recovery_phrase'
              : 'wallets.recovery_phrase_read.protect_my_wallet'
            ) | translate
          }}
        </ion-title>
        <ion-label class="step-counter" *ngIf="!this.protectedWallet" slot="end"
          >1 {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="rpr ion-padding-start ion-padding-end">
      <div class="ux_main">
        <div class="ux_content">
          <div class="rpr__title">
            <ion-text class="ux-font-text-lg" color="primary">
              {{ 'wallets.recovery_phrase_read.title' | translate }}
            </ion-text>
            <div class="rpr__title__icon">
              <ion-icon
                icon="information-circle"
                *ngIf="!this.protectedWallet"
                appTrackClick
                [dataToTrack]="{ eventLabel: 'ux_protect_information' }"
              ></ion-icon>
              <ion-icon *ngIf="this.protectedWallet" icon="information-circle"></ion-icon>
            </div>
          </div>
          <div class="rpr__text">
            <ion-text
              class="ux-font-text-base"
              color="neutral90"
              [innerHTML]="
                (this.protectedWallet
                  ? 'wallets.recovery_phrase_read.text'
                  : 'wallets.recovery_phrase_read.text_protect_my_wallet'
                ) | translate
              "
            >
            </ion-text>
          </div>
          <div class="rpr__button-show-hide">
            <ion-button
              name="Toggle Phrase"
              class="ux_button"
              color="info"
              appTrackClick
              fill="clear"
              size="small"
              (click)="this.togglePhrase()"
            >
              {{
                (!this.isRevealed
                  ? 'wallets.recovery_phrase_read.button_show_phrase'
                  : 'wallets.recovery_phrase_read.button_hide_phrase'
                ) | translate
              }}
            </ion-button>
          </div>
          <div class="rpr__phrase-card" *ngIf="this.mnemonic">
            <app-recovery-phrase-card
              [isProtected]="this.protectedWallet"
              [phrase]="this.mnemonic.phrase.split(' ')"
              [showOrder]="true"
            ></app-recovery-phrase-card>
          </div>
          <div class="rpr__information">
            <ion-icon icon="information-circle" class="rpr__information__icon"></ion-icon>
            <div class="rpr__information__text">
              <ion-text class="ux-font-text-base" color="info">
                {{ 'wallets.recovery_phrase_read.security_information' | translate }}
              </ion-text>
            </div>
          </div>
        </div>
        <div class="rpr__footer ux_footer">
          <ion-button
            *ngIf="this.protectedWallet"
            class="ux_button"
            name="ux_phrase_copy"
            type="button"
            fill="{{ this.buttonFill }}"
            color="{{ this.buttonColor }}"
            expand="block"
            size="large"
            appTrackClick
            (click)="this.copyPhrase()"
          >
            {{ this.buttonText | translate }}
          </ion-button>
          <ion-button
            *ngIf="!this.protectedWallet"
            class="ux_button"
            name="ux_protect_continue_phrase"
            type="button"
            [disabled]="!this.isRevealed"
            color="secondary"
            expand="block"
            size="large"
            appTrackClick
            (click)="this.goToVerifyPhrase()"
          >
            {{ 'wallets.recovery_phrase_read.button_continue' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./recovery-phrase-read.page.scss'],
})
export class RecoveryPhraseReadPage implements OnInit {
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  mnemonic: Mnemonic;
  buttonColor: string;
  buttonFill: string;
  buttonText: string;
  buttonText2: string;
  title: string;
  text: string;
  isShowPhrase: boolean;
  isRevealed = false;
  protectedWallet: boolean;
  private password: any;

  constructor(
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService,
    private modalController: ModalController,
    private storage: IonicStorageService,
    private navController: NavController,
    private walletEncryptionService: WalletEncryptionService
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    await this.setProtectedWallet();
    this.setButtonProperties();
    this.clearMnemonic();
  }

  async setProtectedWallet(){
    this.protectedWallet = await this.storage.get('protectedWallet');
  }

  setButtonProperties(){
    this.buttonColor = 'primary';
    this.buttonFill = 'outline';
    this.buttonText = 'wallets.recovery_phrase_read.button_text';
  }

  goToVerifyPhrase() {
    this.navController.navigateForward(['/wallets/create-first/verify-phrase']);
  }

  async copyPhrase() {
    if (!this.isRevealed) {
      await this.togglePhrase();
    }
    this.copyToClipboard();
  }

  copyToClipboard() {
    this.clipboardService.write({ string: this.mnemonic.phrase }).then(
      () => {
        this.buttonColor = 'secondary';
        this.buttonFill = 'solid';
        this.buttonText = 'wallets.recovery_phrase_read.button_text_coppied';
        this.showInfoToast('wallets.recovery_phrase_read.coppied_text');
      },
      () => {
        this.showErrorToast('wallets.recovery_phrase_read.copy_error_text');
      }
    );
  }

  private showInfoToast(text: string) {
    this.toastService.showInfoToast({
      message: this.translate.instant(text),
    });
  }

  private showErrorToast(text: string) {
    this.toastService.showErrorToast({
      message: this.translate.instant(text),
    });
  }
  private async setPassword() {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.password = data;
  }

  private async setMnemonic() {
    const decriptedWallet = await this.walletEncryptionService.getDecryptedWallet(this.password);
    this.mnemonic = decriptedWallet.mnemonic;
  }

  async togglePhrase() {
    if (!this.isRevealed) {
      await this.setPassword();
      try {
        await this.setMnemonic();
        this.isRevealed = !this.isRevealed;
      } catch {
        this.showErrorToast(
          'wallets.recovery_phrase_read.error_toast'
        );
      }
    } else {
      this.clearMnemonic();
      this.clearPassword();
      this.isRevealed = !this.isRevealed;
    }
  }

  clearPassword() {
    this.password = undefined;
  }

  clearMnemonic() {
    this.mnemonic = {
      locale: 'en',
      path: '',
      phrase: '***** ***** ***** ***** ***** ***** ***** ***** ***** ***** ***** *****',
    };
  }

  ionViewWillLeave() {
    this.clearPassword();
    this.clearMnemonic();
  }

}
