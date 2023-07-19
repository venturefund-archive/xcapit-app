import { Injectable } from '@angular/core';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { Wallet, ethers } from 'ethers';
import { XAuthService } from '../../../../users/shared-users/services/x-auth/x-auth.service';
import { AddressesToSave } from '../../models/addresses-to-save/addresses-to-save';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { LoginToken } from '../../../../users/shared-users/models/login-token/login-token';
import { Password } from '../../../../swaps/shared-swaps/models/password/password';
import { IonicStorageService } from '../../../../../shared/services/ionic-storage/ionic-storage.service';
import { WalletBackupService } from '../wallet-backup/wallet-backup.service';
import { NotificationsService } from 'src/app/modules/notifications/shared-notifications/services/notifications/notifications.service';
import { MnemonicOf } from '../../models/mnemonic-of/mnemonic-of';
import { FakeEthersWallet } from 'src/app/modules/swaps/shared-swaps/models/fakes/fake-ethers-wallet';
import { WalletStorageData } from '../../models/wallet-storage-data/wallet-storage-data.interface';
import { SimplifiedWallet } from '../../models/simplified-wallet/simplified-wallet';
import { ActiveLender } from '../../../../../shared/models/active-lender/active-lender';

@Injectable({
  providedIn: 'root',
})
export class WalletInitializeProcess {
  private readonly _pushNotificacionTopic = 'app';
  private readonly _pushNotificationStorageKey = '_enabledPushNotifications';
  private warrantyWallet: boolean;
  ethersWallet: typeof Wallet | FakeEthersWallet = Wallet;
  private _lenderName: string;

  constructor(
    private blockchains: BlockchainsFactory,
    private xAuthService: XAuthService,
    private apiWalletService: ApiWalletService,
    private walletEncryptionService: WalletEncryptionService,
    private ionicStorageService: IonicStorageService,
    private walletBackupService: WalletBackupService,
    private notificationsService: NotificationsService
  ) {}

  public async run(password: Password, isImport: boolean, walletStorageData: WalletStorageData) {
    await this._backupLender();
    await this._clearStorage();
    await this._createXAuthToken(password);
    await this._saveWallets();
    await walletStorageData.save();
    await this._createLoginToken(password);
    await this._setWalletAsProtected(isImport);
    await this._initializeNotifications();
    await this._enableBackupWarningModal();
    await this._saveWarrantyWallet(isImport);
    await this._restoreLender();
  }

  private async _backupLender() {
    this._lenderName = await new ActiveLender(this.ionicStorageService).name();
  }

  private async _restoreLender(): Promise<void> {
    await new ActiveLender(this.ionicStorageService).save(this._lenderName);
  }

  private async _clearStorage(): Promise<void> {
    await this.ionicStorageService.clear();
  }

  private async _createXAuthToken(password: Password): Promise<void> {
    const blockchain = this.blockchains.create().oneByName('ERC20');
    const wallet = this.ethersWallet.fromMnemonic(
      await new MnemonicOf(password, (await this.encryptedWallet()).wallet, this.ethersWallet).phrase(),
      blockchain.derivedPath(),
      ethers.wordlists.en
    );
    const signedMsg = await wallet.signMessage(wallet.address);
    return this.xAuthService.saveToken(`${wallet.address}_${signedMsg}`);
  }

  private async _saveWallets(): Promise<void> {
    return this.apiWalletService
      .saveWalletAddresses(new AddressesToSave(await this.encryptedWallet()).toJson())
      .toPromise();
  }

  private encryptedWallet(): Promise<any> {
    return this.walletEncryptionService.getEncryptedWallet();
  }

  private async _createLoginToken(password: Password): Promise<void> {
    return new LoginToken(password, this.ionicStorageService).save();
  }

  private async _setWalletAsProtected(isImport: boolean): Promise<void> {
    if (isImport) {
      await this.walletBackupService.disableModal();
    }
  }

  private async _initializeNotifications() {
    if (await this._enabledPushNotifications()) {
      this._pushNotificationsService().subscribeTo(this._pushNotificacionTopic);
    } else {
      this._pushNotificationsService().subscribeTo(this._pushNotificacionTopic);
      this._pushNotificationsService().unsubscribeFrom(this._pushNotificacionTopic);
    }
  }

  private _pushNotificationsService() {
    return this.notificationsService.getInstance();
  }

  private async _enabledPushNotifications(): Promise<boolean> {
    return await this.ionicStorageService.get(this._pushNotificationStorageKey).then((status) => status);
  }

  private async _enableBackupWarningModal() {
    if (!(await this.ionicStorageService.get('protectedWallet'))) {
      await this.walletBackupService.enableModal();
    }
  }

  async setWarrantyWallet(value: boolean): Promise<void> {
    this.warrantyWallet = value;
    this._saveWarrantyWallet(false);
  }

  private async _saveWarrantyWallet(isImport: boolean): Promise<void> {
    await new SimplifiedWallet(this.ionicStorageService).save(isImport ? false : this.warrantyWallet);
  }
}
