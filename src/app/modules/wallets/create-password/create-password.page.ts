import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { ActivatedRoute } from '@angular/router';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
          'wallets.create_password.header' | translate
        }}</ion-title>
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
            [label]="'wallets.create_password.password' | translate"
            inputmode="password"
            [errors]="this.passwordErrors"
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
            <ion-button
              class="ux_button"
              appTrackClick
              name="ux_create_submit_wallet_password"
              type="submit"
              color="secondary"
              size="large"
              [disabled]="this.submitButtonService.isDisabled | async"
            >
              {{ 'wallets.create_password.finish_button' | translate }}
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
  createPasswordForm: FormGroup = this.formBuilder.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
          CustomValidators.patternValidator(/\d/, CustomValidatorErrors.hasNumber),
          CustomValidators.patternValidator(/[A-Z]/, CustomValidatorErrors.hasCapitalCase),
          CustomValidators.patternValidator(/[a-z]/, CustomValidatorErrors.hasSmallCase),
        ],
      ],
      repeat_password: ['', [Validators.required]],
    },
    {
      validators: [CustomValidators.passwordMatchValidator],
    }
  );

  passwordErrors: ItemFormError[] = CONFIG.fieldErrors.password;

  repeatPasswordErrors: ItemFormError[] = [...CONFIG.fieldErrors.repeatPassword, ...CONFIG.fieldErrors.password];
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public submitButtonService: SubmitButtonService,
    private navController: NavController,
    private walletEncryptionService: WalletEncryptionService,
    private loadingService: LoadingService,
    private apiWalletService: ApiWalletService,
    private translate: TranslateService
  ) {}

  ionViewWillEnter() {
    this.loadingService.enabled();
    this.mode = this.route.snapshot.paramMap.get('mode');
  }

  ngOnInit() {}

  handleSubmit() {
    if (this.createPasswordForm.valid) {
      this.loadingService
        .showModal(this.modalOptions())
        .then(() => this.walletEncryptionService.encryptWallet(this.createPasswordForm.value.password))
        .then(() => this.walletEncryptionService.getEncryptedWallet())
        .then((encryptedWallet) => this.formattedWallets(encryptedWallet))
        .then((wallets) => this.apiWalletService.saveWalletAddresses(wallets).toPromise())
        .then(() => this.loadingService.dismiss())
        .then(() => this.navigateByMode())
        .then(() => this.loadingService.dismissModal());
    } else {
      this.createPasswordForm.markAllAsTouched();
    }
  }

  private modalOptions() {
    return {
      title: this.translate.instant('wallets.create_password.loading.title'),
      subtitle: this.translate.instant(`wallets.create_password.loading.subtitle.${this.mode}`),
      image: 'assets/img/create-password/building.svg',
    };
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
