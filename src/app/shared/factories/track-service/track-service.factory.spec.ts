import { trackServiceFactory } from './track-service.factory';
import { NativeFirebaseLogsService } from '../../services/native-firebase-logs/native-firebase-logs.service';
import { PwaFirebaseLogsService } from '../../services/pwa-firebase-logs/pwa-firebase-logs.service';

describe('TrackServiceFactory', () => {
  beforeEach(() => {});

  it('should create UpdateAppService instance when native platform', () => {
    const result = trackServiceFactory({ isNative: () => true });
    expect(result).toBeInstanceOf(NativeFirebaseLogsService);
  });

  it('should create UpdateAppService instance when not native platform', () => {
    const result = trackServiceFactory({ isNative: () => false });
    expect(result).toBeInstanceOf(PwaFirebaseLogsService);
  });
});
