import { UpdateAppService } from '../../services/update-app/update-app.service';
import { UpdatePWAService } from '../../services/update-pwa/update-pwa.service';

export function updateServiceFactory(platformService, alertController, translate, http, swUpdate, loadingService) {
  if (platformService.isNative()) {
    return new UpdateAppService(alertController, translate, http);
  } else {
    return new UpdatePWAService(alertController, translate, http, swUpdate, loadingService);
  }
}
