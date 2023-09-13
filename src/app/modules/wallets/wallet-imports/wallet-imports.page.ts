import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { GoogleAuthService } from 'src/app/shared/services/google-auth/google-auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { DefaultGoogleDriveFilesRepo } from 'src/app/shared/models/google-drive-files-repo/default/default-google-drive-files-repo';
import { GoogleDriveFilesInjectable } from 'src/app/shared/models/google-drive-files/injectable/google-drive-files.injectable';
import { WalletPasswordComponent } from '../shared-wallets/components/wallet-password/wallet-password.component';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletInitializeProcess } from '../shared-wallets/services/wallet-initialize-process/wallet-initialize-process';
import { IMPORT_ITEM_METHOD } from '../shared-wallets/constants/import-item-method';
import { GDRIVE_ERRORS } from '../shared-wallets/constants/gdrive-errors.constant';
import { PasswordErrorMsgs } from '../../swaps/shared-swaps/models/password/password-error-msgs';
import { GoogleDriveError } from '../shared-wallets/models/google-drive-error/google-drive-error';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import {
  WalletStorageDataFactoryInjectable
} from '../shared-wallets/models/wallet-storage-data/injectable/wallet-storage-data-factory.injectable';
import {structuredClone} from '../../../shared/utils/structured-clone';

@Component({
  selector: 'app-wallet-imports',
  template: `<ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button defaultHref=""></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wallets.wallet_imports.header' | translate }}</ion-title>
        <ion-label class="ux_toolbar__step" slot="end">2 {{ 'shared.step_counter.of' | translate }} 4</ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content class="wi">
      <div class="wi__title">
        <ion-text class="ux-font-text-lg">{{ 'wallets.wallet_imports.title' | translate }}</ion-text>
      </div>
      <div class="wi__subtitle">
        <ion-text class="ux-font-text-base">{{ 'wallets.wallet_imports.subtitle' | translate }}</ion-text>
      </div>
      <div class="wi__method">
        <app-import-method-options *ngFor="let method of methods" [method]="method" (route)="this.navigateTo($event)">
        </app-import-method-options>
      </div>
      <div class="wi__support">
        <ion-text class="ux-link-xs" (click)="goToFaqs()">{{ 'wallets.wallet_imports.support' | translate }}</ion-text>
      </div>
    </ion-content>
    <ion-footer> </ion-footer>`,
  styleUrls: ['./wallet-imports.page.scss'],
})
export class WalletImportsPage {
  methods = structuredClone(IMPORT_ITEM_METHOD);
  gdriveErrors = structuredClone(GDRIVE_ERRORS);
  accessToken: string;
  mnemonic: string;

  constructor(
    private navController: NavController,
    private googleAuthService: GoogleAuthService,
    private http: HttpClient,
    private modalController: ModalController,
    private toastService: ToastService,
    private translate: TranslateService,
    private storageService: StorageService,
    private walletInitializeProcess: WalletInitializeProcess,
    private googleDriveFiles: GoogleDriveFilesInjectable,
    private ionicStorage: IonicStorageService,
    private walletStorageDataFactoryInjectable: WalletStorageDataFactoryInjectable
  ) {}

  async navigateTo(route: string) {
    route === 'googleAuth' ? await this.openModalgoogle() : this.navController.navigateForward(route);
  }

  async openModalgoogle() {
    try {
      const accessToken = await this.googleAuthService.accessToken();
      await this.checkBackup(accessToken);
    } catch (error) {
      this.showErrorToast(this._googleDriveError(error));
    }
  }

  async setWalletBackup() {
    this.ionicStorage.set('wallet_backup', true);
  }

  async checkBackup(accessToken: string) {
    try {
      await this._saveWalletFromGoogleDrive(accessToken);
    } catch (error) {
      this.showErrorToast(this._googleDriveError(error));
    }
  }

  private _googleDriveError(error: any): string {
    return new GoogleDriveError(error).value();
  }

  private async _saveWalletFromGoogleDrive(accessToken: string) {
    const googleDriveFiles = this.googleDriveFiles.create(new DefaultGoogleDriveFilesRepo(this.http, accessToken));
    const fileList = await googleDriveFiles.all();
    if (fileList.length > 0) {
      await this.storageService.saveWalletToStorage(JSON.parse(await googleDriveFiles.contentOf(fileList[0])));
      await this._initializeWallet(await this._askForPassword());
    } else {
      await this.showInfoToast();
    }
  }

  private async _initializeWallet(password: Password) {
    try {
      await this.walletInitializeProcess.run(
        password,
        true,
        this.walletStorageDataFactoryInjectable.create().oneBy('drive')
      );
      await this.setWalletBackup();
      this.navigateToSuccess();
    } catch (error) {
      if (new PasswordErrorMsgs().isInvalidError(error)) {
        this.showErrorToast('password');
        await this.storageService.removeWalletFromStorage();
      }
    }
  }

  showInfoToast(): Promise<any> {
    return this.toastService.showInfoToast({
      message: this.translate.instant('wallets.wallet_imports.toasts.info'),
    });
  }

  private async _askForPassword() {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      componentProps: {
        state: 'send',
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    const password = new Password(data);

    return password;
  }

  goToFaqs() {
    this.navController.navigateForward('/support/faqs/wallet');
  }

  navigateToSuccess() {
    this.navController.navigateRoot('/wallets/recovery/success');
  }

  showErrorToast(type: string): Promise<any> {
    return this.toastService.showErrorToast({
      message: this.translate.instant(`wallets.wallet_imports.toasts.${type}`),
    });
  }
}
