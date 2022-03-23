import { Injectable } from '@angular/core';
import { RemoteConfiguration } from '../../interfaces/remote-configuration.interface';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {
  private remoteConfig: RemoteConfiguration;

  constructor() { }

  initialize(remoteConfig: RemoteConfiguration): Promise<void> {
    this.remoteConfig = remoteConfig;
    return this.remoteConfig.initialize();
  }

  getFeatureFlag(param: string): boolean {
    return this.remoteConfig.getFeatureFlag(param);
  }
}
