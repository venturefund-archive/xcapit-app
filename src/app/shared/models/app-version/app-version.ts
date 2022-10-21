import { AppInfo } from '@capacitor/app';
import { RemoteConfigService } from '../../services/remote-config/remote-config.service';
import { CapacitorApp } from '../capacitor-app/capacitor-app.interface';

export class AppVersion {
  constructor(private readonly app: CapacitorApp, private remoteConfigService: RemoteConfigService) {}

  public current(): Promise<string> {
    return this.app.info().then((res: AppInfo) => res.version);
  }

  public lastAvailable(): string {
    return this.remoteConfigService.getString('lastVersion');
  }

  public async updated(): Promise<boolean> {
    return (await this.current()) === this.lastAvailable();
  }
}
