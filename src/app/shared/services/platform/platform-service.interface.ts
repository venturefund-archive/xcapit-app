export interface PlatformService {
  isWeb(): boolean;
  isNative(): boolean;
  platform(): string;
}
