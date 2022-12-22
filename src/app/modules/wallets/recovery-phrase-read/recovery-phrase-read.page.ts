import { Component, OnInit, ViewChild } from '@angular/core';
import { Mnemonic } from '@ethersproject/hdnode';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { IonAccordionGroup, ModalController, NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WalletPasswordComponent } from '../shared-wallets/components/wallet-password/wallet-password.component';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { InfoPhraseAdviceModalComponent } from '../shared-wallets/components/info-phrase-advice-modal/info-phrase-advice-modal.component';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

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
            <div
              class="rpr__title__icon"
              name="ux_protect_information"
              appTrackClick
              (click)="this.showPhraseInfoAdvice()"
            >
              <ion-icon icon="information-circle"></ion-icon>
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
              [disabled]="this.isModalPasswordOpen"
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
          <ion-label *ngIf="this.loading" class="ux-loading-message ux-font-text-xxs" color="neutral80">
            {{ 'wallets.recovery_phrase_read.loading_label' | translate }}
          </ion-label>
          <ion-button
            *ngIf="this.protectedWallet"
            class="ux_button"
            name="ux_phrase_copy"
            type="button"
            fill="{{ this.buttonFill }}"
            color="{{ this.buttonColor }}"
            expand="block"
            size="large"
            [disabled]="this.loading"
            [appLoading]="this.loading"
            [loadingText]="'wallets.recovery_phrase_read.loading_text' | translate"
            [innerHTML]="this.buttonText"
            appTrackClick
            (click)="this.copyPhrase()"
          >
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
            [appLoading]="this.loading"
            [loadingText]="'wallets.recovery_phrase_read.loading_text' | translate"
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
  isModalPasswordOpen: boolean;
  isInfoModalOpen = false;
  private password: any;
  loading = false;
  constructor(
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService,
    private modalController: ModalController,
    private storage: IonicStorageService,
    private navController: NavController,
    private walletEncryptionService: WalletEncryptionService,
    private walletMnemonicService: WalletMnemonicService
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    await this.setProtectedWallet();
    this.setButtonProperties();
    this.clearMnemonic();
  }

  async setProtectedWallet() {
    this.protectedWallet = await this.storage.get('protectedWallet');
  }

  setButtonProperties() {
    this.buttonColor = 'primary';
    this.buttonFill = 'outline';
    this.buttonText = this.translate.instant('wallets.recovery_phrase_read.button_text');
  }

  goToVerifyPhrase() {
    this.isRevealed = false;
    this.walletMnemonicService.importMnemonic(this.mnemonic.phrase);
    this.navController.navigateForward(['/wallets/create-first/verify-phrase']);
  }

  async copyPhrase() {
    if (!this.isRevealed) {
      try {
        await this.togglePhrase();
        if (this.password) this.copyToClipboard();
      } catch {
        return;
      }
    } else {
      this.copyToClipboard();
    }
  }

  copyToClipboard() {
    this.clipboardService.write({ string: this.mnemonic.phrase }).then(
      () => {
        this.buttonColor = 'secondary';
        this.buttonFill = 'solid';
        this.buttonText = this.translate.instant('wallets.recovery_phrase_read.button_text_copied');
        this.showInfoToast('wallets.recovery_phrase_read.copied_text');
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
    const decriptedWallet = await this.walletEncryptionService.getDecryptedERC20Wallet(this.password);
    this.mnemonic = decriptedWallet.mnemonic;
  }

  toggleLoading() {
    this.loading = !this.loading;
  }

  async togglePhrase() {
    if (!this.isRevealed) {
      this.toggleLoading();
      this.isModalPasswordOpen = true;
      await this.setPassword();
      try {
        this.isModalPasswordOpen = false;
        await this.setMnemonic();
        this.toggleLoading();
        this.isRevealed = !this.isRevealed;
      } catch (e) {
        if (this.password) {
          this.toggleLoading();
          this.showErrorToast('wallets.recovery_phrase_read.error_toast');
          this.clearPassword();
        } else {
          this.toggleLoading();
        }
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
    this.isRevealed = false;
  }

  async showPhraseInfoAdvice() {
    if (this.isInfoModalOpen === false) {
      this.isInfoModalOpen = true;
      const modal = await this.modalController.create({
        component: InfoPhraseAdviceModalComponent,
        componentProps: {},
        cssClass: 'ux-hug-modal-informative',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }
}
