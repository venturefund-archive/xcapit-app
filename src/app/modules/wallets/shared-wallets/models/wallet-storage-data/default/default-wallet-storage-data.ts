import { LoggedIn } from 'src/app/modules/users/shared-users/models/logged-in/logged-in';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { StorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { WalletStorageData } from '../wallet-storage-data.interface';

export class DefaultWalletStorageData implements WalletStorageData {
  constructor(private _aStorage: StorageService) {}
  async save(): Promise<void> {
    await this._saveUserAcceptTos();
    await this._saveTokensStructureMigrated();
    await this._saveEnabledPushNotifications();
    await this._saveLoggedIn();
  }

  private async _saveUserAcceptTos(): Promise<void> {
    await this._aStorage.set('userAcceptedToS', true);
  }
  private async _saveTokensStructureMigrated(): Promise<void> {
    await this._aStorage.set('tokens_structure_migrated', true);
  }
  private async _saveEnabledPushNotifications(): Promise<void> {
    if (!(await this._aStorage.get('_enabledPushNotifications'))) {
      await this._aStorage.set('_enabledPushNotifications', true);
    }
  }
  private async _saveLoggedIn(): Promise<void> {
    await new LoggedIn(this._aStorage).save(true);
  }
}
