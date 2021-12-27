import { NativeFirebaseLogsService } from '../../services/native-firebase-logs/native-firebase-logs.service';
import { PwaFirebaseLogsService } from '../../services/pwa-firebase-logs/pwa-firebase-logs.service';

export function trackServiceFactory(platformService, firebaseService) {
  if (platformService.isNative()) {
    return new NativeFirebaseLogsService(firebaseService);
  } else {
    return new PwaFirebaseLogsService();
  }
}
