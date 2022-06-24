import { DefiProduct } from '../../interfaces/defi-product.interface';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

export class AvailableDefiProducts {
  constructor(private remoteConfig: RemoteConfigService) {}
  value(): DefiProduct[] {
    return this.remoteConfig.getObject('investmentProducts');
  }
}
