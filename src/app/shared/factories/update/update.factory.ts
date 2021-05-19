import { PlatformService } from '../../services/platform/platform.service';
import { UpdatePWAService } from '../../services/update-pwa/update-pwa.service';
import { UpdateAppService } from '../../services/update-app/update-app.service';
import { Injectable } from '@angular/core';
import { UpdateService } from '../../services/update/update.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateFactory {
  constructor(
    private platformService: PlatformService,
    private updateAppService: UpdateAppService,
    private updatePWAService: UpdatePWAService
  ) {}

  public getInstance(): UpdateService {
    return this.platformService.isNative() ? this.updateAppService : this.updatePWAService;
  }
}
