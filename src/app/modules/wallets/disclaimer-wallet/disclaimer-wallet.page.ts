import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { StorageWalletsService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { LINKS } from 'src/app/config/static-links';

@Component({
  selector: 'app-disclaimer-wallet',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__left ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-start" *ngIf="this.mode === 'import'">{{
          'wallets.recovery_wallet.header' | translate
        }}</ion-title>
        <ion-title class="ion-text-start" *ngIf="this.mode !== 'import'">{{
          'wallets.disclaimer.header' | translate
        }}</ion-title>
        <ion-label class="ux_toolbar__step" slot="end"
          >1 {{ 'shared.step_counter.of' | translate }} {{ this.mode !== 'import' ? '2' : '3' }}</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="this.disclaimerForm" class="ux_main" (ngSubmit)="this.handleSubmit()">
        <div class="ux_content">
          <div>
            <ion-text name="Title" class="ux-font-text-lg">{{ 'wallets.disclaimer.title' | translate }}</ion-text>
          </div>
          <div class="description">
            <ion-text name="Description" class="ux-font-text-xs">
              {{
                (this.mode !== 'import'
                  ? 'wallets.disclaimer.create_wallet_description'
                  : 'wallets.disclaimer.import_wallet_description'
                ) | translate
              }}</ion-text
            >
          </div>
          <div class="ux-documents">
            <div
              class="ux-documents__item"
              lines="none"
              name="ux_terms_and_conditions"
              (click)="openDocument(links.xcapitTermsAndConditions)"
            >
              <ion-icon name="ux-document"></ion-icon>
              <ion-label class="ux-font-text-lg">{{ 'wallets.disclaimer.terms_and_conditions' | translate }}</ion-label>
              <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
            </div>
            <div
              class="ux-documents__item"
              lines="none"
              name="ux_privacy_policy"
              (click)="openDocument(links.xcapitPrivacyPolicy)"
            >
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
            ></ion-checkbox>
          </ion-item>
          <ion-button
            class="ux_button"
            appTrackClick
            [dataToTrack]="{ eventLabel: this.trackClickEventName }"
            [disabled]="!this.disclaimerForm.valid"
            name="Submit"
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
  mode: string;
  links = LINKS;
  disclaimerForm: UntypedFormGroup = this.formBuilder.group({
    agreePhraseCheckbox: [false, [Validators.requiredTrue]],
  });
  trackClickEventName: string;

  private get isImporting(): boolean {
    return this.mode === 'import';
  }

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private navController: NavController,
    private storageWalletsService: StorageWalletsService,
    private browserService: BrowserService
  ) {}

  ngOnInit() {
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.trackClickEventName = this.isImporting ? 'ux_import_submit' : 'ux_create_submit';
  }

  handleSubmit() {
    this.acceptToS();
    this.navigateByMode();
  }
  
  navigateByMode() {
    const url = this.isImporting ? 'wallets/recovery' : 'wallets/create-password/create';
    this.navController.navigateForward([url]);
  }

  openDocument(url): void {
    this.browserService.open({ url });
  }

  acceptToS() {
    this.storageWalletsService.acceptToS();
  }
}
