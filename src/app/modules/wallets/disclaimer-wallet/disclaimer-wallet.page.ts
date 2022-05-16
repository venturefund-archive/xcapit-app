import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastAlertComponent } from 'src/app/shared/components/new-toasts/toast-alert/toast-alert.component';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { StorageWalletsService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { LINKS } from 'src/app/config/static-links';

@Component({
  selector: 'app-disclaimer-wallet',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title *ngIf="this.mode === 'import'" >{{
          'wallets.recovery_wallet.header' | translate
        }}</ion-title>
        <ion-title *ngIf="this.mode !== 'import'" >{{
          'wallets.disclaimer.header' | translate
        }}</ion-title>
        <ion-label class="step-counter" slot="end"
          >1 {{ 'shared.step_counter.of' | translate }} {{this.mode !== "import" ? '2' : '3'}}</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="this.disclaimerForm" class="ux_main" (ngSubmit)="this.handleSubmit()">
        <div class="ux_content">
          <div>
            <ion-text name="Title" class="ux-font-text-xl">{{ 'wallets.disclaimer.title' | translate }}</ion-text>
          </div>
          <div class="description">
            <ion-text name="Description" class="ux-font-text-xs">
              {{ (this.mode !== "import" ? 'wallets.disclaimer.create_wallet_description'  : 'wallets.disclaimer.import_wallet_description') | translate }}</ion-text>
          </div>
          <div class="ux-documents">
            <div class="ux-documents__item" lines="none" name='ux_terms_and_conditions' (click)="openDocument(links.xcapitTermsAndConditions)">
              <ion-icon name="ux-document"></ion-icon>
              <ion-label class="ux-font-text-lg">{{ 'wallets.disclaimer.terms_and_conditions' | translate }}</ion-label>
              <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
            </div>
            <div class="ux-documents__item" lines="none" name='ux_privacy_policy' (click)="openDocument(links.xcapitPrivacyPolicy)">
              <ion-icon name="ux-document"></ion-icon>
              <ion-label class="ux-font-text-lg">{{ 'wallets.disclaimer.privacy_policy' | translate }}</ion-label>
              <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
            </div>
          </div>

          <app-wallet-advice
            [logo]="'ux-device'"
            [text]="'wallets.disclaimer.wallet_term_text'"
            [link]="'wallets.disclaimer.wallet_term_link'"
          ></app-wallet-advice>
        </div>
        <div name="Disclaimer Form Buttons" class="ux_footer">
          <ion-item class="last ux-font-text-xs">
            <ion-label>
              {{ 'wallets.disclaimer.agree_phrase_checkbox' | translate }}
            </ion-label>
            <ion-checkbox
              mode="md"
              name="ux_create_disclaimer_check_button_1"
              formControlName="agreePhraseCheckbox"
              slot="start"
              (ionChange)="this.enableButton()"
            ></ion-checkbox>
          </ion-item>
          <ion-button
            class="ux_button"
            appTrackClick
            [dataToTrack]="{ eventLabel: this.trackClickEventName }"
            [disabled]="!this.disclaimerForm.valid"
            name="ux_create_submit"
            type="submit"
            color="secondary"
            size="large"
          >
            {{ 'wallets.disclaimer.submit_button' | translate }}
          </ion-button>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./disclaimer-wallet.page.scss'],
})
export class DisclaimerWalletPage implements OnInit {
  acceptTos = false;
  mode: string;
  hasAcceptedDisclaimer: boolean;
  links = LINKS;
  disclaimerForm: FormGroup = this.formBuilder.group({
    agreePhraseCheckbox: [false, [Validators.requiredTrue]],
  });
  trackClickEventName: string;
  
  private get isImporting(): boolean {
    return this.mode === 'import';
  }

  constructor(
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private navController: NavController,
    private translate: TranslateService,
    private storageWalletsService: StorageWalletsService,
    private browserService: BrowserService
  ) {}
  
  ngOnInit() {
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.trackClickEventName = this.isImporting ? 'ux_import_submit' : 'ux_create_submit';
  }

  handleSubmit() {
    if (this.disclaimerForm.valid) {
      this.acceptToS();
      this.navigateByMode();
    } else {
      this.showModalDidNotAccept();
    }
  }
  navigateByMode() {
    const url = this.isImporting ? 'wallets/recovery' : 'wallets/select-coins';
    this.navController.navigateForward([url]);
  }

  openDocument(url): void{
    this.browserService.open({url});
  }

  enableButton() {
    return (this.acceptTos = !this.acceptTos);
  }

  async showModalDidNotAccept() {
    const modal = await this.modalController.create({
      component: ToastAlertComponent,
      cssClass: 'ux-alert',
      showBackdrop: false,
      componentProps: {
        title: this.translate.instant('wallets.disclaimer.error_did_not_accept'),
        type: 'error',
      },
    });
    await modal.present();
  }

  acceptToS() {
    this.storageWalletsService.acceptToS();
  }
}
