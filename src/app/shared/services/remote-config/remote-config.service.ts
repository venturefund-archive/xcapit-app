import { Injectable } from '@angular/core';
import { RemoteConfiguration } from '../../interfaces/remote-configuration.interface';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  private remoteConfig: RemoteConfiguration;

  constructor() {}

  async initialize(remoteConfig: RemoteConfiguration): Promise<void> {
    this.remoteConfig = remoteConfig;
    await this.remoteConfig.initialize();
  }

  getFeatureFlag(param: string): boolean {
    return this.remoteConfig.getFeatureFlag(param);
  }

  getString(name: string) {
    return this.remoteConfig.getString(name);
  }

  getObject(name: string): any {
    return this.remoteConfig.getObject(name);
  }
}
