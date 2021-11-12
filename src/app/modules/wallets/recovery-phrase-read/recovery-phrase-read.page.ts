import { Component, OnInit } from '@angular/core';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { Mnemonic } from '@ethersproject/hdnode';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recovery-phrase-read',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/recovery/info"></ion-back-button>
        </ion-buttons>
        <ion-title class="ux-font-text-lg">{{ 'wallets.recovery_phrase_read.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="rpr ion-padding-start ion-padding-end">
      <div class="ux_main">
        <div class="ux_content">
          <div class="rpr__title">
            <ion-text class="ux-font-text-lg" color="uxprimary">
              {{ 'wallets.recovery_phrase_read.title' | translate }}
            </ion-text>
          </div>
          <div class="rpr__text">
            <ion-text class="ux-font-text-base" color="uxdark">
              {{ 'wallets.recovery_phrase_read.text' | translate }}
            </ion-text>
          </div>
          <div class="rpr__phrase-card" *ngIf="this.mnemonic">
            <app-recovery-phrase-card
              [phrase]="this.mnemonic.phrase.split(' ')"
              [showOrder]="true"
            ></app-recovery-phrase-card>
          </div>
        </div>
        <div class="rpr__footer ux_footer">
          <ion-button
            class="ux_button"
            name="Copy"
            type="button"
            fill="{{ this.buttonFill }}"
            color="{{ this.buttonColor }}"
            expand="block"
            size="large"
            appTrackClick
            (click)="this.copyToClipboard()"
          >
            {{ this.buttonText | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./recovery-phrase-read.page.scss'],
})
export class RecoveryPhraseReadPage implements OnInit {
  mnemonic: Mnemonic;
  buttonColor: string;
  buttonFill: string;
  buttonText: string;
  constructor(
    private walletMnemonicService: WalletMnemonicService,
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.buttonColor = 'uxprimary';
    this.buttonFill = 'outline';
    this.buttonText = 'wallets.recovery_phrase_read.button_text';
    this.mnemonic = this.walletMnemonicService.mnemonic;
  }

  copyToClipboard() {
    this.clipboardService.write({ string: this.mnemonic.phrase }).then(
      () => {
        this.buttonColor = 'uxsecondary';
        this.buttonFill = 'solid';
        this.buttonText = 'wallets.recovery_phrase_read.button_text_coppied';
        this.showToast('wallets.recovery_phrase_read.coppied_text');
      },
      () => {
        this.showToast('wallets.recovery_phrase_read.copy_error_text');
      }
    );
  }

  private showToast(text: string) {
    this.toastService.showToast({
      message: this.translate.instant(text),
    });
  }
}
