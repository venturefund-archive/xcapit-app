import { PlatformService } from '../../services/platform/platform.service';
import { TrackService } from '../../services/track/track.service';
import { trackServiceFactory } from '../../factories/track-service/track-service.factory';

export const trackServiceProvider = {
  provide: TrackService,
  useFactory: trackServiceFactory,
  deps: [PlatformService],
};