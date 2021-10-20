import { Injectable } from '@angular/core';
import { TrackService, DataToTrackEvent, DataToTrackView } from '../track/track.service';
import '@capacitor-community/firebase-analytics';
import { Plugins } from '@capacitor/core';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseLogsService implements TrackService {
  firebaseAnalytics = Plugins.FirebaseAnalytics;

  constructor(private firebaseService: FirebaseService) {}

  startTracker() {
    this.firebaseService.init();
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
