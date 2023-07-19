import { Injectable } from '@angular/core';
import { RemoteConfiguration } from '../../interfaces/remote-configuration.interface';
import { RemoteConfig } from './remote-config.interface';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService implements RemoteConfig {
  private remoteConfig: RemoteConfiguration;

  constructor() {}

  async initialize(remoteConfig: RemoteConfiguration): Promise<void> {
    this.remoteConfig = remoteConfig;
    await this.remoteConfig.initialize();
  }

  getFeatureFlag(param: string): boolean {
    return this.remoteConfig.getFeatureFlag(param);
  }

  getString(name: string): string {
    return this.remoteConfig.getString(name);
  }

  getObject(name: string): any {
    return this.remoteConfig.getObject(name);
  }
}
