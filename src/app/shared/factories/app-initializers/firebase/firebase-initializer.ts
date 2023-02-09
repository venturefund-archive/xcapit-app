import { RemoteConfigService } from '../../../services/remote-config/remote-config.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { FirebaseRemoteConfig } from '../../../models/firebase-remote-config/firebase-remote-config';

export function firebaseInitializer(remoteConfig: RemoteConfigService, firebase: FirebaseService) {
  return () => firebase.init().then(() => remoteConfig.initialize(new FirebaseRemoteConfig(firebase.getApp()))).catch(()=>{});
}
