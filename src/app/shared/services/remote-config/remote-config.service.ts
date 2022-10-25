import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RemoteConfiguration } from '../../interfaces/remote-configuration.interface';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  private remoteConfig: RemoteConfiguration;
  private isInitialized = new BehaviorSubject(false);

  constructor() {}

  async initialize(remoteConfig: RemoteConfiguration): Promise<void> {
    this.remoteConfig = remoteConfig;
    await this.remoteConfig.initialize();
    this.isInitialized.next(true);
  }

  public initialized(): Observable<boolean> {
    return this.isInitialized.asObservable();
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
