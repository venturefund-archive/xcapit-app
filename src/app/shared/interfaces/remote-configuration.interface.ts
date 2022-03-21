export interface RemoteConfiguration {
    defaultConfig;
    initialize(): Promise<void>;
    setDefaultConfig();
    get(param: string): any;
    getFeatureFlag(param: string): boolean;
}