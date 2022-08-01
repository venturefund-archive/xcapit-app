import { Injectable } from '@angular/core';
import { TrackService, DataToTrackEvent, DataToTrackView } from '../track/track.service';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

@Injectable({
  providedIn: 'root',
})
export class NativeFirebaseLogsService implements TrackService {
  firebaseAnalytics = FirebaseAnalytics;

  constructor() {}

  startTracker() {
    this.firebaseAnalytics.setCollectionEnabled({ enabled: true });
  }

  trackLogin(userId?: string) {
    this.firebaseAnalytics.logEvent({
      name: 'login',
      params: {
        method: 'Xcapit',
      },
    });
  }

  trackSignUp(userId?: string) {
    this.firebaseAnalytics.logEvent({
      name: 'sign_up',
      params: {
        method: 'Xcapit',
      },
    });
  }

  trackView(data: DataToTrackView): void {}

  trackEvent(data: DataToTrackEvent, customParams: any={}): void {
    if (data.eventLabel.startsWith('ux_'))
      this.firebaseAnalytics.logEvent({
        name: data.eventLabel,
        params: {
          name: data.eventLabel,
          action: data.eventAction,
          value: data.eventValue,
          category: data.eventCategory,
          ...customParams
        },
      });
  }
}
