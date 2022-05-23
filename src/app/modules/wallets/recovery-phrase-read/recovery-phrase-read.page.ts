import { Component, OnInit, ViewChild } from '@angular/core';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { Mnemonic } from '@ethersproject/hdnode';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { IonAccordionGroup } from '@ionic/angular';

@Component({
  selector: 'app-recovery-phrase-read',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
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
            <ion-text class="ux-font-text-lg" color="primary">
              {{ 'wallets.recovery_phrase_read.title' | translate }}
            </ion-text>
            <ion-icon icon="information-circle"></ion-icon>
          </div>
          <div class="rpr__text">
            <ion-text class="ux-font-text-base" color="neutral90">
              {{ 'wallets.recovery_phrase_read.text' | translate }}
            </ion-text>
          </div>
          <div class="rpr__footer ux_footer">
          <ion-button            
            name="Toggle Accordion"
            class="ux_button ion-no-margin"
            color="info"
            appTrackClick
            fill="clear"
            size="small"
            ><!--           
            (click)="this.toggleAccordion()" -->
            {{ this.buttonText2 | translate }}
          </ion-button>
        </div>
          <div class="rpr__phrase-card" *ngIf="this.mnemonic">
            <app-recovery-phrase-card
              [phrase]="this.mnemonic.phrase.split(' ')"
              [showOrder]="true"
            ></app-recovery-phrase-card>
          </div>
        </div>
        <div class="rpr__footer ux_footer">
          <!--los eventos de firebase van en el name?? name=”ux_phrase_copy” -->
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
 // @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  mnemonic: Mnemonic;
  buttonColor: string;
  buttonFill: string;
  buttonText: string;
  buttonText2: string;
  isAccordionOpen: boolean;
  constructor(
    private walletMnemonicService: WalletMnemonicService,
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    //this.closeAccordion();
  }

  ionViewWillEnter() {
    this.buttonColor = 'primary';
    this.buttonFill = 'outline';
    this.buttonText2 = 'wallets.recovery_phrase_read.button_show_sentence';
    this.buttonText = 'wallets.recovery_phrase_read.button_text';
    this.mnemonic = this.walletMnemonicService.mnemonic;
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

 // toggleAccordion() {
  //  if (this.isAccordionOpen) {
  //    this.closeAccordion();
///} else {
//this.openAccordion();
  //  }
  //}

  //Abre el Ver Mas
//  private openAccordion() {
 //   this.buttonText = 'wallets.recovery_phrase_read.button_show_sentence';
    //this.accordionGroup.value = 'operations';
 //   this.isAccordionOpen = true;
//}
//Cierra el ver mas
//  private closeAccordion() {
  //  this.buttonText = 'wallets.recovery_phrase_read.button_show_sentence';
    //this.accordionGroup.value = undefined;
   // this.isAccordionOpen = false;
//  }
}
