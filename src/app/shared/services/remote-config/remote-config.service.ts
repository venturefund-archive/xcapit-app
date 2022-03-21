import { Injectable } from '@angular/core';
import { RemoteConfiguration } from '../../interfaces/remote-configuration.interface';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {
  remoteConfig: RemoteConfiguration;

  constructor() { }

  initialize(): Promise<void> {
    return this.remoteConfig.initialize();
  }

  getFeatureFlag(param: string): boolean {
    return this.remoteConfig.getFeatureFlag(param);
  }
}
