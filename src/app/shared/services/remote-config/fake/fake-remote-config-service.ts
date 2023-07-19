import { RemoteConfiguration } from 'src/app/shared/interfaces/remote-configuration.interface';
import { RemoteConfig } from '../remote-config.interface';

export class FakeRemoteConfigService implements RemoteConfig {
  constructor(private _getObjectReturn: any = [], private _getFeatureFlagReturn: boolean = false) {}

  initialize(remoteConfig: RemoteConfiguration): Promise<void> {
    return Promise.resolve();
  }

  getObject(name: string): any {
    return this._getObjectReturn;
  }

  getFeatureFlag(param: string): boolean {
    return this._getFeatureFlagReturn;
  }

  getString(name: string): string {
    return '';
  }
}
