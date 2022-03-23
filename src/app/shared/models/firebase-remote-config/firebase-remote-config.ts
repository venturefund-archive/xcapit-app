import { FirebaseApp } from 'firebase/app';
import * as firebase from 'firebase/remote-config';
import { RemoteConfig } from 'firebase/remote-config';
import { REMOTE_CONFIG_DEFAULTS } from '../../constants/remote-config-defaults.constant';
import { RemoteConfiguration } from '../../interfaces/remote-configuration.interface';

export class FirebaseRemoteConfig implements RemoteConfiguration {
  firebaseRemoteConfig = firebase;
  defaultConfig = REMOTE_CONFIG_DEFAULTS;
  private remoteConfig: RemoteConfig;
  private fetchTimeMillis = 2000;

  constructor(private readonly firebaseApp: FirebaseApp) {}

  initialize(): Promise<void> {
    this.remoteConfig = this.firebaseRemoteConfig.getRemoteConfig(this.firebaseApp);
    this.setDefaultConfig();
    return this.fetchAndActivate();
  }

  fetchAndActivate(): Promise<void> {
    return this.firebaseRemoteConfig.fetchAndActivate(this.remoteConfig) as Promise<any>;
  }

  setDefaultConfig() {
    this.remoteConfig.settings.minimumFetchIntervalMillis = this.fetchTimeMillis;
    this.remoteConfig.defaultConfig = this.defaultConfig;
  }

  getFeatureFlag(param: string): boolean {
    return this.firebaseRemoteConfig.getValue(this.remoteConfig, param).asBoolean();
  }
}
