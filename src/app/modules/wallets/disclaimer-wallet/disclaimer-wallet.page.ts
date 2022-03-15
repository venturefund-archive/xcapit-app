import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastAlertComponent } from 'src/app/shared/components/new-toasts/toast-alert/toast-alert.component';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { StorageWalletsService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';

@Component({
  selector: 'app-disclaimer-wallet',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title *ngIf="this.mode === 'import'" class="ion-text-center">{{
          'wallets.recovery_wallet.header' | translate
        }}</ion-title>
        <ion-title *ngIf="this.mode !== 'import'" class="ion-text-center">{{
          'wallets.disclaimer.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="this.disclaimerForm" class="ux_main" (ngSubmit)="this.handleSubmit()">
        <div class="ux_content">
          <div>
            <ion-text name="Title" class="ux-font-text-xl">{{ 'wallets.disclaimer.title' | translate }}</ion-text>
          </div>
          <div class="description">
            <ion-text name="Description" class="ux-font-text-xs">{{
              'wallets.disclaimer.description' | translate
            }}</ion-text>
          </div>
          <div name="Disclaimer Form Checkboxes" class="checkbox_card">
            <ion-item class="ion-no-padding ion-no-margin checkbox">
              <div class="ux_checkbox_container">
                <ion-item class="ux_checkbox_container__item ux-font-text-xs">
                  <ion-label class="ux_checkbox_container__item__label checkbox__label">
                    {{ 'wallets.disclaimer.local_stored_keys_checkbox' | translate }}
                  </ion-label>
                  <ion-checkbox formControlName="localStoredKeysCheckbox" slot="start"></ion-checkbox>
                </ion-item>
              </div>
            </ion-item>

            <ion-item class="ion-no-padding ion-no-margin checkbox">
              <div class="ux_checkbox_container">
                <ion-item class="ux_checkbox_container__item ux-font-text-xs">
                  <ion-label class="ux_checkbox_container__item__label checkbox__label">
                    {{ 'wallets.disclaimer.recovery_phrase_checkbox' | translate }}
                  </ion-label>
                  <ion-checkbox formControlName="recoveryPhraseCheckbox" slot="start"></ion-checkbox>
                </ion-item>
              </div>
            </ion-item>

            <ion-item class="ion-no-padding ion-no-margin checkbox last">
              <div class="ux_checkbox_container">
                <ion-item class="ux_checkbox_container__item ux-font-text-xs">
                  <ion-label class="ux_checkbox_container__item__label checkbox__label">
                    {{ 'wallets.disclaimer.terms_of_use_checkbox' | translate }}
                  </ion-label>
                  <ion-checkbox formControlName="termsOfUseCheckbox" slot="start"></ion-checkbox>
                </ion-item>
              </div>
            </ion-item>
          </div>
        </div>
        <div name="Disclaimer Form Buttons" class="ux_footer">
          <div class="button">
            <ion-button
              appTrackClick
              class="ux-link-xs underline"
              name="Terms of Use"
              type="button"
              size="small"
              fill="clear"
              (click)="this.showTermsOfUse()"
            >
              {{ 'wallets.disclaimer.terms_of_use_button' | translate }}
            </ion-button>
          </div>
          <div class="button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="ux_create_submit"
              type="submit"
              color="secondary"
              size="large"
              [disabled]="this.submitButtonService.isDisabled | async"
            >
              {{ 'wallets.disclaimer.submit_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./disclaimer-wallet.page.scss'],
})
export class DisclaimerWalletPage implements OnInit {
  mode: string;
  hasAcceptedDisclaimer: boolean;
  disclaimerForm: FormGroup = this.formBuilder.group({
    localStoredKeysCheckbox: [false, [Validators.requiredTrue]],
    recoveryPhraseCheckbox: [false, [Validators.requiredTrue]],
    termsOfUseCheckbox: [false, [Validators.requiredTrue]],
  });

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public submitButtonService: SubmitButtonService,
    private modalController: ModalController,
    private navController: NavController,
    private translate: TranslateService,
    private storageWalletsService: StorageWalletsService,
    private browserService: BrowserService
  ) {}

  ngOnInit() {
    this.mode = this.route.snapshot.paramMap.get('mode');
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
    const url = this.mode === 'import' ? 'wallets/recovery' : 'wallets/select-coins';
    this.navController.navigateForward([url]);
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

  async showTermsOfUse() {
    await this.browserService.open({
      url: 'https://xcapit.com/tyc/',
    });
  }

  acceptToS() {
    this.storageWalletsService.acceptToS();
  }
}
