export interface RemoteConfiguration {
  defaultConfig;
  initialize(): Promise<void>;
  setDefaultConfig();
  getFeatureFlag(param: string): boolean;
  getString(name: string): string;
  getObject(name: string): any;
}
