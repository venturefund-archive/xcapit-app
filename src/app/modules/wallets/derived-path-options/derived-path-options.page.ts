import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { WalletCreationMethod } from 'src/app/shared/types/wallet-creation-method.type';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';

@Component({
  selector: 'app-derived-path-options',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="" (click)="this.setCreationMethod()"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center" *ngIf="this.mode === 'import'">{{
          'wallets.derived_path_options.header.import' | translate
        }}</ion-title>
        <ion-title class="ion-text-center" *ngIf="this.mode !== 'import'">{{
          'wallets.derived_path_options.header.create' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="dpo ion-padding">
      <div class="dpo__title">
        <ion-text *ngIf="this.mode === 'import'" class="ux-font-text-lg">{{
          'wallets.derived_path_options.title.import' | translate
        }}</ion-text>
        <ion-text *ngIf="this.mode !== 'import'" class="ux-font-text-lg">{{
          'wallets.derived_path_options.title.create' | translate
        }}</ion-text>
      </div>
      <form [formGroup]="this.form">
        <div class="dpo__radio_group">
          <ion-radio-group formControlName="method">
            <div class="container">
              <ion-item class="ux-font-text-lg">
                <ion-label>{{ 'wallets.derived_path_options.first_option.title' | translate }}</ion-label>
                <ion-radio
                  appTrackClick
                  name="ux_radio_default"
                  [dataToTrack]="{ eventLabel: this.trackClickNameDefault }"
                  mode="md"
                  slot="start"
                  value="default"
                ></ion-radio>
              </ion-item>
              <div class="dpo__radio_group__description">
                <ion-text class="ux-font-text-base">{{
                  'wallets.derived_path_options.first_option.description' | translate
                }}</ion-text>
              </div>
            </div>
            <div class="container">
              <ion-item class="ux-font-text-lg">
                <ion-label>{{ 'wallets.derived_path_options.second_option.title' | translate }}</ion-label>
                <ion-radio
                  appTrackClick
                  name="ux_radio_other"
                  [dataToTrack]="{ eventLabel: this.trackClickNameother }"
                  mode="md"
                  slot="start"
                  value="legacy"
                ></ion-radio>
              </ion-item>
              <div class="dpo__radio_group__description">
                <ion-text class="ux-font-text-base">{{
                  'wallets.derived_path_options.second_option.description1' | translate
                }}</ion-text>
              </div>
              <div class="dpo__radio_group__description separate">
                <ion-text
                  class="ux-font-text-base"
                  [innerHTML]="'wallets.derived_path_options.second_option.description2' | translate"
                >
                </ion-text>
              </div>
              <div class="dpo__radio_group__disclaimer">
                <ion-text class="ux-font-text-xs">{{ 'wallets.derived_path_options.disclaimer' | translate }}</ion-text>
              </div>
            </div>
          </ion-radio-group>
        </div>
      </form>
    </ion-content>
    <ion-footer>
      <ion-text class="dpo__link ux-link-xs" (click)="goToFaqs()">{{
        'wallets.derived_path_options.link' | translate
      }}</ion-text>
    </ion-footer>
  `,
  styleUrls: ['./derived-path-options.page.scss'],
})
export class DerivedPathOptionsPage {
  form: UntypedFormGroup = this.formBuilder.group({
    method: ['', [Validators.required]],
  });
  mode: string;
  trackClickNameDefault: string;
  trackClickNameother: string;
  headerText: string;
  titleText: string;
  method: WalletCreationMethod;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private walletEncryptionService: WalletEncryptionService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.eventNames();
    this.form.valueChanges.subscribe((res) => {
      this.method = res.method;
    });
    this.form.patchValue({ method: this.walletEncryptionService.creationMethod });
  }

  eventNames() {
    if (this.mode === 'create') {
      this.trackClickNameDefault = `ux_${this.mode}_default`;
      this.trackClickNameother = `ux_${this.mode}_other`;
    } else {
      this.trackClickNameDefault = `ux_${this.mode}_default`;
      this.trackClickNameother = `ux_${this.mode}_other`;
    }
  }
  setCreationMethod() {
    this.walletEncryptionService.creationMethod = this.method;
  }

  goToFaqs() {
    this.navController.navigateForward('/support/faqs/wallet');
  }
}
