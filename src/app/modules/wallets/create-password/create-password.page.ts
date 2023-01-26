import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { ActivatedRoute } from '@angular/router';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WalletBackupService } from '../shared-wallets/services/wallet-backup/wallet-backup.service';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { XAuthService } from '../../users/shared-users/services/x-auth/x-auth.service';
import { LoginToken } from '../../users/shared-users/models/login-token/login-token';
import { Password } from '../../swaps/shared-swaps/models/password/password';
import { LoggedIn } from '../../users/shared-users/models/logged-in/logged-in';
import { ethers } from 'ethers';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { WalletCreationMethod } from 'src/app/shared/types/wallet-creation-method.type';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

@Component({
  selector: 'app-create-password',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded ux_toolbar__left">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title *ngIf="this.mode === 'import'">{{ 'wallets.recovery_wallet.header' | translate }}</ion-title>
        <ion-title *ngIf="this.mode !== 'import'">{{ 'wallets.create_password.header' | translate }}</ion-title>
        <ion-label *ngIf="this.mode === 'import'" class="ux_toolbar__step" slot="end"
          >3 {{ 'shared.step_counter.of' | translate }} 3</ion-label
        >
        <ion-label *ngIf="this.mode !== 'import'" class="ux_toolbar__step" slot="end"
          >2 {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="this.createPasswordForm" class="ux_main">
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
            [textClass]="'primary'"
            [label]="'wallets.create_password.write_password' | translate"
            inputmode="password"
            [errors]="this.passwordErrors"
            [showNewPasswordErrors]="true"
          ></app-ux-input>

          <app-ux-input
            controlName="repeat_password"
            type="password"
            [textClass]="'primary'"
            [label]="'wallets.create_password.repeat_password' | translate"
            inputmode="password"
            [errors]="this.repeatPasswordErrors"
          ></app-ux-input>
          <app-backup-information-card
            [text]="'wallets.create_password.disclaimer'"
            [textClass]="'ux-home-backup-card'"
          >
          </app-backup-information-card>
        </div>
      </form>
    </ion-content>

    <ion-footer>
      <div name="Create Password Form Buttons" class="ux_footer">
        <div class="import_method">
          <div class="texts">
            <div class="title">
              <ion-text *ngIf="this.mode !== 'import'" class="ux-font-text-lg">{{
                'wallets.create_password.creation_method' | translate
              }}</ion-text>
              <ion-text *ngIf="this.mode === 'import'" class="ux-font-text-lg">{{
                'wallets.create_password.import_method' | translate
              }}</ion-text>
            </div>
            <div class="subtitle">
              <ion-text class="ux-font-text-base" *ngIf="this.methohd === 'default'">{{
                'wallets.create_password.default_derived_path' | translate
              }}</ion-text>
              <ion-text class="ux-font-text-base" *ngIf="this.methohd !== 'default'">{{
                'wallets.create_password.blockchain_derived_path' | translate
              }}</ion-text>
            </div>
          </div>
          <div class="edit_button">
            <ion-button
              class="ux_button ion-no-margin ion-no-padding"
              fill="clear"
              name="ux_edit"
              appTrackClick
              [dataToTrack]="{ eventLabel: this.trackClickName }"
              (click)="goToDerivedPathOptions()"
              >{{ 'wallets.create_password.edit_derived_path_button' | translate }}</ion-button
            >
          </div>
        </div>
        <div class="button">
          <ion-button
            *ngIf="this.mode !== 'import'"
            class="ux_button ion-no-margin"
            display="block"
            appTrackClick
            [disabled]="!this.createPasswordForm.valid"
            name="ux_create_submit_wallet_password"
            color="secondary"
            size="large"
            [appLoading]="this.loading"
            [loadingText]="'wallets.create_password.creating_button_state' | translate"
            (click)="this.handleSubmit()"
          >
            {{ 'wallets.create_password.finish_button_create' | translate }}
          </ion-button>
          <ion-button
            *ngIf="this.mode === 'import'"
            class="ux_button ion-no-margin"
            appTrackClick
            [disabled]="!this.createPasswordForm.valid"
            name="ux_import_submit_wallet_password"
            color="secondary"
            size="large"
            [appLoading]="this.loading"
            [loadingText]="'wallets.create_password.importing_button_state' | translate"
            (click)="this.handleSubmit()"
          >
            {{ 'wallets.create_password.finish_button_import' | translate }}
          </ion-button>
          <ion-label *ngIf="this.loading" class="ux-loading-message ux-font-text-xxs" color="neutral80">
            {{ 'wallets.create_password.wait_loading_message' | translate }}
          </ion-label>
        </div>
      </div>
    </ion-footer>
  `,
  styleUrls: ['./create-password.page.scss'],
})
export class CreatePasswordPage implements OnInit {
  private readonly _aTopic = 'app';
  private readonly _aKey = 'enabledPushNotifications';
  mode: string;
  loading: boolean;
  methohd: WalletCreationMethod;
  createPasswordForm: UntypedFormGroup = this.formBuilder.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
          CustomValidators.patternValidator(
            /^((?=.*[A-Z])|(?=.*[a-z]))(?=.*[0-9])\S*?$/,
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
  trackClickName: string;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private navController: NavController,
    private walletEncryptionService: WalletEncryptionService,
    private loadingService: LoadingService,
    private apiWalletService: ApiWalletService,
    private walletService: WalletService,
    private walletMnemonicService: WalletMnemonicService,
    private ionicStorageService: IonicStorageService,
    private walletBackupService: WalletBackupService,
    private blockchains: BlockchainsFactory,
    private xAuthService: XAuthService,
    private notificationsService: NotificationsService,
    private remoteConfig: RemoteConfigService
  ) {}

  ionViewWillEnter() {
    this.methohd = this.walletEncryptionService.creationMethod;
    this.loadingService.enabled();
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.enablePushNotificationsByDefault();
    this.trackClickName = `ux_${this.mode}_edit`;
  }

  async ionViewDidEnter() {
    this.walletService.coins = this.apiWalletService.getInitialTokens();
    if (this.mode === 'create') {
      this.walletMnemonicService.mnemonic = this.walletMnemonicService.newMnemonic();
    }
  }

  ngOnInit() {}

  private encryptWallet(): Promise<any> {
    return this.walletEncryptionService.encryptWallet(this.createPasswordForm.value.password);
  }

  private encryptedWallet(): Promise<any> {
    return this.walletEncryptionService.getEncryptedWallet();
  }

  private async saveWallets(): Promise<void> {
    return this.apiWalletService.saveWalletAddresses(this.formattedWallets(await this.encryptedWallet())).toPromise();
  }

  async handleSubmit() {
    if (this.createPasswordForm.valid) {
      this.loading = true;
      setTimeout(async () => {
        await this.encryptWallet();
        await this.createXAuthToken();
        await this.saveWallets();
        await this.createLoginToken();
        await this.loginUser();
        await this.setWalletAsProtectedIfImporting();
        await this.initializeNotifications();
        this.loading = false;
        await this.navigateByMode();
      }, 0);
    } else {
      this.createPasswordForm.markAllAsTouched();
    }
  }

  private async loginUser(): Promise<void> {
    return new LoggedIn(this.ionicStorageService).save(true);
  }

  async enabledPushNotifications(): Promise<boolean> {
    return await this.ionicStorageService.get(this._aKey).then((status) => status);
  }

  pushNotificationsService() {
    return this.notificationsService.getInstance();
  }

  async enablePushNotificationsByDefault() {
    if ((await this.enabledPushNotifications()) === null) {
      await this.ionicStorageService.set(this._aKey, true);
    }
  }

  async initializeNotifications() {
    this.pushNotificationsService().init();
    if (await this.enabledPushNotifications()) {
      this.pushNotificationsService().subscribeTo(this._aTopic);
    } else {
      this.pushNotificationsService().subscribeTo(this._aTopic);
      this.pushNotificationsService().unsubscribeFrom(this._aTopic);
    }
  }

  private async createLoginToken(): Promise<void> {
    return new LoginToken(new Password(this.createPasswordForm.value.password), this.ionicStorageService).save();
  }

  private async createXAuthToken(): Promise<void> {
    const blockchain = this.blockchains.create().oneByName('ERC20');
    const wallet = ethers.Wallet.fromMnemonic(
      this.walletMnemonicService.mnemonic.phrase,
      blockchain.derivedPath(),
      ethers.wordlists.en
    );
    const signedMsg = await wallet.signMessage(wallet.address);
    return this.xAuthService.saveToken(`${wallet.address}_${signedMsg}`);
  }

  private setWalletAsProtectedIfImporting(): Promise<void[]> {
    if (this.mode === 'import') {
      return Promise.all([
        this.ionicStorageService.set('protectedWallet', true),
        this.walletBackupService.disableModal(),
      ]);
    }
  }

  private formattedWallets(encryptedWallet: any): any {
    return Object.keys(encryptedWallet.addresses).map((network) => ({
      network,
      address: encryptedWallet.addresses[network],
    }));
  }

  navigateByMode() {
    const remoteConfig = this.remoteConfig.getFeatureFlag('ff_experimentOnboarding');
    let url = '/wallets/recovery/success';
    if (this.mode !== 'import') {
      url = remoteConfig ? 'wallets/experimental-onboarding' : '/wallets/success-creation';
    }

    return this.navController.navigateRoot([url]);
  }

  goToDerivedPathOptions() {
    const url = this.mode === 'import' ? 'wallets/derived-path-options/import' : 'wallets/derived-path-options/create';
    this.navController.navigateForward(url);
  }
}
