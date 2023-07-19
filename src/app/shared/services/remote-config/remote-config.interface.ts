import { RemoteConfiguration } from '../../interfaces/remote-configuration.interface';

export interface RemoteConfig {
  initialize(remoteConfig: RemoteConfiguration): Promise<void>;
  getFeatureFlag(param: string): boolean;
  getString(name: string);
  getObject(name: string): any;
}
