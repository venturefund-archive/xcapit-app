import { FirebaseApp } from 'firebase/app';
import * as firebase from 'firebase/remote-config';
import { RemoteConfig } from 'firebase/remote-config';
import { REMOTE_CONFIG_DEFAULTS } from '../../constants/remote-config-defaults.constant';
import { RemoteConfiguration } from '../../interfaces/remote-configuration.interface';
import { FirebaseService } from '../../services/firebase/firebase.service';

export class FirebaseRemoteConfig implements RemoteConfiguration {
  firebaseRemoteConfig = firebase;
  defaultConfig = REMOTE_CONFIG_DEFAULTS;
  private remoteConfig: RemoteConfig;
  private app: FirebaseApp;
  private fetchTimeMillis = 2000;

  constructor(private readonly firebaseService: FirebaseService) {}

  initialize(): Promise<void> {
    this.app = this.firebaseService.init();
    this.remoteConfig = this.firebaseRemoteConfig.getRemoteConfig(this.app);
    this.setDefaultConfig();
    return this.fetchAndActivate();
  }

  fetchAndActivate(): Promise<void> {
    return new Promise((resolve) => {
      this.firebaseRemoteConfig.fetchAndActivate(this.remoteConfig).then(() => resolve());
    })
  }

  setDefaultConfig() {
    this.remoteConfig.settings.minimumFetchIntervalMillis = this.fetchTimeMillis;
    this.remoteConfig.defaultConfig = this.defaultConfig;
  }

  getFeatureFlag(param: string): boolean {
    return this.firebaseRemoteConfig.getValue(this.remoteConfig, param).asBoolean();
  }
}
