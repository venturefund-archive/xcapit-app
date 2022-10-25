export interface FeatureFlag {
  evaluate: () => Promise<void>;
}
