import { UpdateService } from '../../services/update/update.service';
import { PlatformService } from '../../services/platform/platform.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { SwUpdate } from '@angular/service-worker';
import { LoadingService } from '../../services/loading/loading.service';
import { updateServiceFactory } from '../../factories/update/update.factory';

export const updateServiceProvider = {
  provide: UpdateService,
  useFactory: updateServiceFactory,
  deps: [PlatformService, AlertController, TranslateService, HttpClient, SwUpdate, LoadingService],
};
