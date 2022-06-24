import { EventEmitter, Injectable } from '@angular/core';
import { RemoteConfiguration } from '../../interfaces/remote-configuration.interface';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  private remoteConfig: RemoteConfiguration;
  isInitialized = false;
  initializationCompleteEvent: EventEmitter<void> = new EventEmitter();

  constructor() {}

  async initialize(remoteConfig: RemoteConfiguration): Promise<void> {
    this.remoteConfig = remoteConfig;
    await this.remoteConfig.initialize();
    this.initializationCompleteEvent.emit();
    this.isInitialized = true;
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
