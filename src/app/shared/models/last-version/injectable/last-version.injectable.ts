import { Injectable } from '@angular/core';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { PlatformService } from '../../../services/platform/platform-service.interface';
import { LastVersion } from '../last-version';
import { AppVersion } from '../../app-version/app-version.interface';
import { RemoteConfig } from '../../../services/remote-config/remote-config.interface';
import { AppVersionInjectable } from '../../app-version/injectable/app-version.injectable';
import { DefaultPlatformService } from 'src/app/shared/services/platform/default/default-platform.service';


@Injectable({ providedIn: 'root' })
export class LastVersionInjectable {

  constructor(
    private appVersionInjectable: AppVersionInjectable,
    private platformService: DefaultPlatformService,
    private remoteConfigService: RemoteConfigService
  ) {}

  create(
    _anAppVersion: AppVersion = this.appVersionInjectable.create(),
    _aRemoteConfig: RemoteConfig = this.remoteConfigService,
    _aPlatformService: PlatformService = this.platformService
  ): LastVersion {

    return new LastVersion(_anAppVersion, _aRemoteConfig, _aPlatformService);
  }
}
