import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TrackService, DataToTrackEvent, DataToTrackView } from '../track/track.service';
import '@capacitor-community/firebase-analytics';
import { Plugins } from '@capacitor/core';
import { PlatformService } from '../platform/platform.service';
import { firebase } from '@firebase/app';

@Injectable({
  providedIn: 'root',
})
export class FirebaseLogsService implements TrackService {
  firebaseAnalytics = Plugins.FirebaseAnalytics;

  constructor(private platformService: PlatformService) {}

  startTracker() {
    if (this.platformService.isWeb() && !firebase.apps.length) {
      this.firebaseAnalytics.initializeFirebase(environment.firebase);
    }
    this.firebaseAnalytics.setCollectionEnabled({ enabled: true });
  }

  trackLogin(userId?: string) {
    // this.firebaseAnalytics.logEvent({
    //   name: 'login',
    //   params: {
    //     method: 'Xcapit',
    //   },
    // });
  }

  trackSignUp(userId?: string) {}

  trackView(data: DataToTrackView): void {}

  trackEvent(data: DataToTrackEvent): void {
    this.firebaseAnalytics.logEvent({
      name: 'button_click',
      params: {
        name: data.eventLabel,
        action: data.eventAction,
        value: data.eventValue,
        category: data.eventCategory,
      },
    });
  }
}
