import { FirebaseApp } from 'firebase/app';
import { fetchAndActivate, getRemoteConfig, getValue, RemoteConfig } from 'firebase/remote-config';
import { REMOTE_CONFIG_DEFAULTS } from '../../constants/remote-config-defaults.constant';
import { RemoteConfiguration } from '../../interfaces/remote-configuration.interface';
import { FirebaseService } from '../../services/firebase/firebase.service';

export class FirebaseRemoteConfig implements RemoteConfiguration {
  defaultConfig = REMOTE_CONFIG_DEFAULTS;
  private app: FirebaseApp;
  private remoteConfig: RemoteConfig;
  private fetchTimeMillis = 2000;

  constructor(private readonly firebaseService: FirebaseService) {}

  async initialize(): Promise<void> {
    this.app = this.firebaseService.init();
    this.remoteConfig = getRemoteConfig(this.app);
    this.setDefaultConfig();
    await this.fetchAndActivate();
  }

  fetchAndActivate(): Promise<boolean> {
    return fetchAndActivate(this.remoteConfig);
  }

  setDefaultConfig() {
    this.remoteConfig.settings.minimumFetchIntervalMillis = this.fetchTimeMillis;
    this.remoteConfig.defaultConfig = this.defaultConfig;
  }

  get(param: string): any {
    return getValue(this.remoteConfig, 'test');
  }

  getFeatureFlag(param: string): boolean {
    return getValue(this.remoteConfig, 'test').asBoolean();
  }
}
