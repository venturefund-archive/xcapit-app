import { AppVersion } from '../app-version/app-version.interface';
import { RemoteConfig } from '../../services/remote-config/remote-config.interface';
import { PlatformService } from '../../services/platform/platform-service.interface';


export class LastVersion {
  constructor(
    private _anAppVersion: AppVersion,
    private _aRemoteConfig: RemoteConfig,
    private _aPlatformService: PlatformService
  ) {}

  async inReview(): Promise<boolean> {
    return this._aPlatformService.isNative()
      ? (await this._anAppVersion.updated()) && this._aRemoteConfig.getFeatureFlag('inReview')
      : false;
  }
}
