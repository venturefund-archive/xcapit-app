import { Injectable } from '@angular/core';
import { UpdateService } from '../update/update.service';
import { ModalController } from '@ionic/angular';
import { RemoteConfigService } from '../remote-config/remote-config.service';

@Injectable({
  providedIn: 'root',
})
export class UpdatePWAService extends UpdateService {
  constructor(
    modalController: ModalController,
    remoteConfigService: RemoteConfigService,
  ) {
    super(modalController, remoteConfigService);
  }

  public update(): Promise<void> { return Promise.resolve() }


  public handleCheckForUpdate(): Promise<void> { return Promise.resolve() }
}
