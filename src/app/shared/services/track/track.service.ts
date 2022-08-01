import { Injectable } from '@angular/core';

export interface DataToTrackView {
  pageUrl?: string;
  screenName?: string;
  eventAction?: string;
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
  providedIn: 'root',
})
export abstract class TrackService {
  abstract startTracker(id?: string): void;
  abstract trackLogin(userId?: string): void;
  abstract trackSignUp(userId?: string): void;
  abstract trackView(data: DataToTrackView): void;
  abstract trackEvent(data: DataToTrackEvent, customParams?: any): void;
}
