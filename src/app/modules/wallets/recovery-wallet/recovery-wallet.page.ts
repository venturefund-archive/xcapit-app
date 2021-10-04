import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';

@Component({
  selector: 'app-recovery-wallet',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <div>
          <ion-title class="rwp__header">{{ 'wallets.recovery_wallet.header' | translate }}</ion-title>
        </div>
        <div class="fd__header-button"></div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content">
          <div class="rwp__title">
            <ion-text class="ux-font-text-xl">
              {{ 'wallets.recovery_wallet.title' | translate }}
            </ion-text>
          </div>
          <div class="rwp__subtitle">
            <ion-text class="ux-font-text-xs resize">
              {{ 'wallets.recovery_wallet.subtitle' | translate }}
            </ion-text>
          </div>
          <div class="rwp__label_and_icon">
            <div class="rwp__label">
              <ion-label class="ux-font-text-xs">{{ 'wallets.recovery_wallet.label' | translate }}</ion-label>
            </div>
            <div class="rwp__copy_button">
              <ion-button
                appTrackClick
                name="Paste Phrase"
                fill="clear"
                color="uxdark"
                size="small"
                class="cib__buttons__editButton"
                (click)="this.pastePhrase()"
              >
                <ion-icon class="rwp__icon" name="clipboard-outline"></ion-icon>
              </ion-button>
            </div>
          </div>
          <div class="form_component">
            <form [formGroup]="this.form" class="ux_main">
              <app-recovery-wallet-form></app-recovery-wallet-form>
            </form>
          </div>
        </div>
        <div class="ux_footer ">
          <div class="button-next">
            <ion-button
              class="ux_button"
              (click)="this.handleSubmit()"
              appTrackClick
              name="Import Wallet"
              type="submit"
              color="uxsecondary"
              size="large"
            >
              {{ 'wallets.recovery_wallet.button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./recovery-wallet.page.scss'],
})
export class RecoveryWalletPage implements OnInit {
  validPhrase: string;
  form: FormGroup = this.formBuilder.group({
    phrase: ['', [Validators.required, CustomValidators.countWords(12)]],
  });

  constructor(
    private clipboardService: ClipboardService,
    private formBuilder: FormBuilder,
    private walletMnemonicService: WalletMnemonicService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  pastePhrase() {
    this.clipboardService.read().then((result) => {
      if (result.type === 'text/plain') {
        this.form.patchValue({ phrase: result.value });
      }
    });
  }

  eraseSpacesBetweenWords() {
    this.validPhrase = this.form.value.phrase.trim().replace(/\s\s+/g, ' ');
  }

  handleSubmit() {
    if (this.form.valid) {
      try {
        this.eraseSpacesBetweenWords();
        this.walletMnemonicService.importMnemonic(this.validPhrase);
        this.navController.navigateForward(['wallets/select-coins', 'import']);
      } catch (e) {
        this.navController.navigateForward(['wallets/recovery/error']);
      }
    }
  }
}
