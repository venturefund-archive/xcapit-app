import { ModalController } from '@ionic/angular';
import { UpdateAppModalComponent } from '../../components/update-app-modal/update-app-modal.component';
import { RemoteConfigService } from '../remote-config/remote-config.service';
export abstract class UpdateService {
  protected constructor(
    private modalController: ModalController,
    private remoteConfigService: RemoteConfigService,
  ) {}

  protected isEnabledByFeatureFlag(): boolean {
    return this.remoteConfigService.getFeatureFlag('ff_updateAppModal');
  }

  public abstract update(): Promise<void>;

  async showRecommendedModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: UpdateAppModalComponent,
      cssClass: 'update-app-modal'
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data)
      this.update();
  }

  public checkForUpdate(): Promise<void> {
    if (this.isEnabledByFeatureFlag())
      return this.handleCheckForUpdate();
  }

  protected abstract handleCheckForUpdate(): Promise<void>;
}
