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

  trackEvent(data: DataToTrackEvent): void {
    const copy = Object.assign({}, data)
    if (data.eventLabel.startsWith('ux_'))
    this.firebaseAnalytics.logEvent({
        name: data.eventLabel,
        params: {
          name: this.pop(copy, 'eventLabel'),
          action: this.pop(copy, 'eventAction'),
          value:  this.pop(copy, 'eventValue'),
          category: this.pop(copy, 'eventCategory'),
          ...copy
        },
      });
  }

  pop(obj: any, key: string, defaultValue: any = null) {
    let value;
    if (obj.hasOwnProperty(key)) {
      value = obj[key];
      delete obj[key];
    } else {
      value = defaultValue;
    }
    return value;
  }
}
