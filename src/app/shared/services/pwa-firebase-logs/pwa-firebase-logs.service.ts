import { Injectable } from '@angular/core';
import { TrackService, DataToTrackEvent, DataToTrackView } from '../track/track.service';

@Injectable({
  providedIn: 'root',
})
export class PwaFirebaseLogsService implements TrackService {
  constructor() {}

  startTracker() {}

  trackLogin(userId?: string) {}

  trackSignUp(userId?: string) {}

  trackView(data: DataToTrackView): void {}

  trackEvent(data: DataToTrackEvent): void {}
}
