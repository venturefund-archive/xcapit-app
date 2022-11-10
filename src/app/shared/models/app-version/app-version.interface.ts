export interface AppVersion {
  current(): Promise<string>;
  lastAvailable(): string;
  updated(): Promise<boolean>;
}
