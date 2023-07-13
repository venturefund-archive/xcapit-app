import { RemoteConfiguration } from 'src/app/shared/interfaces/remote-configuration.interface';
import { RemoteConfig } from '../remote-config.interface';

export class FakeRemoteConfigService implements RemoteConfig {
  constructor(private _getObjectReturn: any = []) {}

  initialize(remoteConfig: RemoteConfiguration): Promise<void> {
    return Promise.resolve();
  }

  getObject(name: string): any {
    return this._getObjectReturn;
  }

  getFeatureFlag(param: string): boolean {
    return false;
  }

  getString(name: string): string {
    return '';
  }
}
