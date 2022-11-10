import { Injectable } from '@angular/core';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { CapacitorApp } from '../../capacitor-app/capacitor-app.interface';
import { DefaultCapacitorApp } from '../../capacitor-app/default/default-capacitor-app';
import { AppVersion } from '../app-version.interface';
import { DefaultAppVersion } from '../default/default-app-version';

@Injectable({ providedIn: 'root' })
export class AppVersionInjectable {
  constructor(private remoteConfigService: RemoteConfigService) {}

  create(capacitorApp: CapacitorApp = new DefaultCapacitorApp()): AppVersion {
    return new DefaultAppVersion(capacitorApp, this.remoteConfigService);
  }
}
