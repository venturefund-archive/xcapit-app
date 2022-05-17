import { UpdateAppService } from '../../services/update-app/update-app.service';
import { UpdatePWAService } from '../../services/update-pwa/update-pwa.service';

export function updateServiceFactory(platformService, modalController, remoteConfigService) {
  if (platformService.isNative()) {
    return new UpdateAppService(modalController, remoteConfigService);
  } else {
    return new UpdatePWAService(modalController, remoteConfigService);
  }
}
