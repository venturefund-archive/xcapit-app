import { NativeFirebaseLogsService } from '../../services/native-firebase-logs/native-firebase-logs.service';
import { PwaFirebaseLogsService } from '../../services/pwa-firebase-logs/pwa-firebase-logs.service';

export function trackServiceFactory(platformService) {
  if (platformService.isNative()) {
    return new NativeFirebaseLogsService();
  } else {
    return new PwaFirebaseLogsService();
  }
}
