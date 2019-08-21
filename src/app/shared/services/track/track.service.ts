import { Injectable } from '@angular/core';

export interface DataToTrackView {
  pageUrl?: string;
  screenName?: string;
  [propName: string]: any;
}

export interface DataToTrackEvent {
  eventCategory?: string;
  eventLabel?: string;
  eventAction?: string;
  eventValue?: string;
  [propName: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export abstract class TrackService {
  abstract startTracker(id?: string): void;
  abstract trackView(data: DataToTrackView): void;
  abstract trackEvent(data: DataToTrackEvent): void;
}
