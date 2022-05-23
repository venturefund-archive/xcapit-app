import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { ActivatedRoute } from '@angular/router';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { TranslateService } from '@ngx-translate/core';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';

@Component({
  selector: 'app-create-password',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__left">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title *ngIf="this.mode === 'import'">{{ 'wallets.recovery_wallet.header' | translate }}</ion-title>
        <ion-title *ngIf="this.mode !== 'import'">{{ 'wallets.create_password.header' | translate }}</ion-title>
        <ion-label *ngIf="this.mode === 'import'" class="step-counter" slot="end"
          >3 {{ 'shared.step_counter.of' | translate }} 3</ion-label
        >
        <ion-label *ngIf="this.mode !== 'import'" class="step-counter" slot="end"
          >2 {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="this.createPasswordForm" class="ux_main" (ngSubmit)="this.handleSubmit()">
        <div class="ux_content">
          <div>
            <ion-text name="Title" class="ux-font-text-lg">{{ 'wallets.create_password.title' | translate }}</ion-text>
          </div>
          <div class="description ion-margin-top">
            <ion-text name="Description" class="ux-font-text-base">{{
              'wallets.create_password.description' | translate
            }}</ion-text>
          </div>

          <app-ux-input
            controlName="password"
            type="password"
            [label]="'wallets.create_password.write_password' | translate"
            inputmode="password"
            [errors]="this.passwordErrors"
            [showNewPasswordErrors]="true"
          ></app-ux-input>

          <app-ux-input
            controlName="repeat_password"
            type="password"
            [label]="'wallets.create_password.repeat_password' | translate"
            inputmode="password"
            [errors]="this.repeatPasswordErrors"
          ></app-ux-input>
        </div>
        <div name="Create Password Form Buttons" class="ux_footer">
          <div class="button">
            <ion-label *ngIf="this.loading" class="ux-loading-message ux-font-text-xxs" color="neutral80"
              > {{'wallets.create_password.wait_loading_message' | translate}}
            </ion-label>
            <ion-button
              *ngIf="this.mode !== 'import'"
              class="ux_button"
              appTrackClick
              [disabled]="!this.createPasswordForm.valid"
              name="ux_create_submit_wallet_password"
              type="submit"
              color="secondary"
              size="large"
              [appLoading]="this.loading"
              [loadingText]="'wallets.create_password.creating_button_state' | translate"
            >
              {{ 'wallets.create_password.finish_button_create' | translate }}
            </ion-button>
            <ion-button
              *ngIf="this.mode === 'import'"
              class="ux_button"
              appTrackClick
              [disabled]="!this.createPasswordForm.valid"
              name="ux_import_submit_wallet_password"
              type="submit"
              color="secondary"
              size="large"
              [appLoading]="this.loading"
              [loadingText]="'wallets.create_password.importing_button_state' | translate"
            >
              {{ 'wallets.create_password.finish_button_import' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./create-password.page.scss'],
})
export class CreatePasswordPage implements OnInit {
  mode: string;
  loading: boolean;
  createPasswordForm: FormGroup = this.formBuilder.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
          CustomValidators.patternValidator(
            /^((?=.*[A-Z])|(?=.*[a-z]))(?=.*[0-9])\w*?$/,
            CustomValidatorErrors.notAlphanumeric
          ),
          CustomValidators.patternValidator(/[A-Z]/, CustomValidatorErrors.hasCapitalCase),
          CustomValidators.patternValidator(/[a-z]/, CustomValidatorErrors.hasSmallCase),
          CustomValidators.patternValidator(/(?=.*[a-z])(?=.*[A-Z])/, CustomValidatorErrors.hasCapitalAndSmallCase),
        ],
      ],
      repeat_password: ['', [Validators.required]],
    },
    {
      validators: [CustomValidators.passwordMatchValidator],
    }
  );

  passwordErrors: ItemFormError[] = CONFIG.fieldErrors.createWalletPassword;

  repeatPasswordErrors: ItemFormError[] = [
    ...CONFIG.fieldErrors.repeatPassword,
    ...CONFIG.fieldErrors.createWalletPassword,
  ];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private walletEncryptionService: WalletEncryptionService,
    private loadingService: LoadingService,
    private apiWalletService: ApiWalletService,
    private walletService: WalletService,
    private translate: TranslateService,
    private walletMnemonicService: WalletMnemonicService
  ) {}

  ionViewWillEnter() {
    this.loadingService.enabled();
    this.mode = this.route.snapshot.paramMap.get('mode');
  }

  async ionViewDidEnter(){
    if (this.mode === 'create') {
      this.walletService.coins = this.apiWalletService.getCoins().filter((coin) => coin.native);
      this.walletMnemonicService.mnemonic = this.walletMnemonicService.newMnemonic();
      await this.walletService.create();
    }
  }

  ngOnInit() {}

  handleSubmit() {
    if (this.createPasswordForm.valid) {
      this.loading = true;
      this.walletEncryptionService
        .encryptWallet(this.createPasswordForm.value.password)
        .then(() => this.walletEncryptionService.getEncryptedWallet())
        .then((encryptedWallet) => this.formattedWallets(encryptedWallet))
        .then((wallets) => this.apiWalletService.saveWalletAddresses(wallets).toPromise())
        .then(() => (this.loading = false))
        .then(() => this.navigateByMode());
    } else {
      this.createPasswordForm.markAllAsTouched();
    }
  }

  formattedWallets(encryptedWallet: any): Promise<any> {
    return Promise.resolve(
      Object.keys(encryptedWallet.addresses).map((network) => ({
        network,
        address: encryptedWallet.addresses[network],
      }))
    );
  }

  navigateByMode() {
    const url = this.mode === 'import' ? '/wallets/recovery/success' : '/wallets/success-creation';
    return this.navController.navigateForward([url]);
  }
}
