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

@Injectable({
  providedIn: 'root',
})
export class WalletInitializeProcess {
  private readonly _pushNotificacionTopic = 'app';
  private readonly _pushNotificationStorageKey = '_enabledPushNotifications';
  ethersWallet: typeof Wallet | FakeEthersWallet = Wallet;
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
    await this._createXAuthToken(password);
    await this._saveWallets();
    await walletStorageData.save();
    await this._createLoginToken(password);
    await this._setWalletAsProtected(isImport);
    await this._initializeNotifications();
    await this._enableBackupWarningModal();
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
}
