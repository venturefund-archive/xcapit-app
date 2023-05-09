import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { InfoPhraseModalComponent } from '../shared-wallets/components/info-phrase-modal/info-phrase-modal.component';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';

@Component({
  selector: 'app-recovery-wallet',
  template: ` 
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="rwp__header">{{
          'wallets.recovery_wallet.header' | translate
        }}</ion-title>
        <ion-label class="ux_toolbar__step" slot="end"
          >3 {{ 'shared.step_counter.of' | translate }} 4</ion-label
        >
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content">
          <div class="rwp__title">
            <ion-text class="ux-font-text-lg">
              {{ 'wallets.recovery_wallet.title' | translate }}
            </ion-text>
            <ion-button
              class="ion-no-padding"
              slot="icon-only"
              fill="clear"
              appTrackClick
              name="ux_phrase_information"
              size="small"
              (click)="this.showPhraseInfo()"
            >
              <ion-icon name="ux-info-circle-outline" color="info"></ion-icon>
            </ion-button>
          </div>
          <div class="rwp__subtitle">
            <ion-text class="ux-font-text-base-primary">
              {{ 'wallets.recovery_wallet.subtitle' | translate }}
            </ion-text>
          </div>
          <div class="rwp__label_and_icon">
            <div class="rwp__label">
              <ion-label class="ux-font-titulo-xs">{{ 'wallets.recovery_wallet.label' | translate }}</ion-label>
            </div>
            <div class="rwp__copy_button">
              <ion-button
                appTrackClick
                name="Paste Phrase"
                fill="clear"
                color="info"
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
              <app-recovery-wallet-form controlName="phrase"></app-recovery-wallet-form>
            </form>
          </div>
        </div>
        <div class="ux_footer ">
          <div class="button-next">
            <ion-button
              class="ux_button"
              (click)="this.handleSubmit()"
              appTrackClick
              [disabled]="!this.form.valid"
              name="ux_import_submit_phrase"
              type="submit"
              color="secondary"
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
  isInfoModalOpen = false;
  form: UntypedFormGroup = this.formBuilder.group({
    phrase: ['', [
      Validators.required, 
      CustomValidators.advancedCountWords(12, CustomValidatorErrors.twelveWords),
      CustomValidators.patternValidator(/^(\w+\s?)+$/, CustomValidatorErrors.spaceBetween, true),
      CustomValidators.hasNoSpecialCharacters()
    ]],
  });

  constructor(
    private clipboardService: ClipboardService,
    private formBuilder: UntypedFormBuilder,
    private walletMnemonicService: WalletMnemonicService,
    private navController: NavController,
    private modalController: ModalController
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
        this.navController.navigateForward(['wallets/create-password', 'import']);
      } catch (e) {
        this.navController.navigateForward(['wallets/recovery/error']);
      }
    }
  }

  async showPhraseInfo() {
    if (this.isInfoModalOpen === false) {
      this.isInfoModalOpen = true
      const modal = await this.modalController.create({
        component: InfoPhraseModalComponent,
        componentProps: {},
        cssClass: 'ux-sm-modal-informative',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }
}
