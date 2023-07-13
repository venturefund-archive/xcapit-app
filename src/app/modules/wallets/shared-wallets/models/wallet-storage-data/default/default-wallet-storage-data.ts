import { LoggedIn } from 'src/app/modules/users/shared-users/models/logged-in/logged-in';
import { StorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { WalletStorageData } from '../wallet-storage-data.interface';
import { ApiProfilesService } from 'src/app/modules/profiles/shared-profiles/services/api-profiles/api-profiles.service';

export class DefaultWalletStorageData implements WalletStorageData {
  constructor(private _aStorage: StorageService, private _aProfileService: ApiProfilesService) {}
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
      const profileData = await this._aProfileService.getUserData().toPromise();
      await this._aStorage.set('_enabledPushNotifications', profileData.notifications_enabled);
    }
  }
  private async _saveLoggedIn(): Promise<void> {
    await new LoggedIn(this._aStorage).save(true);
  }
}
