export interface RemoteConfiguration {
    defaultConfig;
    initialize(): Promise<void>;
    setDefaultConfig();
    getFeatureFlag(param: string): boolean;
}