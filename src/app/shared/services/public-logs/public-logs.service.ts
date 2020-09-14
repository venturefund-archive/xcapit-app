import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  TrackService,
  DataToTrackEvent,
  DataToTrackView
} from '../track/track.service';

@Injectable({
  providedIn: 'root'
})
export class PublicLogsService implements TrackService {
  entity = 'public_logs';
  endpoint = 'stats';
  constructor(private http: HttpClient) {}

  startTracker() {}

  trackView(data: DataToTrackView): void {
    this.http
      .post(`${environment.apiUrl}/${this.endpoint}/${this.entity}`, {
        component_id: data.screenName,
        description: data.pageUrl,
        event_id: data.eventAction,
        fired_at: new Date()
      })
      .subscribe();
  }

  trackEvent(data: DataToTrackEvent): void {
      this.http
        .post(`${environment.apiUrl}/${this.endpoint}/${this.entity}`, {
          button_id: data.eventLabel,
          event_id: data.eventAction,
          description: data.description,
          fired_at: new Date()
        })
        .subscribe();
  }
}
