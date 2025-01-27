import { UpdateService } from '../../services/update/update.service';
import { DefaultPlatformService } from '../../services/platform/default/default-platform.service';
import { ModalController } from '@ionic/angular';
import { updateServiceFactory } from '../../factories/update/update.factory';
import { RemoteConfigService } from '../../services/remote-config/remote-config.service';

export const updateServiceProvider = {
  provide: UpdateService,
  useFactory: updateServiceFactory,
  deps: [DefaultPlatformService, ModalController, RemoteConfigService],
};
