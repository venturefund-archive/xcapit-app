import { Directive, HostListener, Input, ElementRef } from '@angular/core';
import { TrackService } from '../../services/track/track.service';
import { ITrackClickDirective } from './track-click.interface';

@Directive({
  selector: '[appTrackClick]',
})
export class TrackClickDirective implements ITrackClickDirective {
  @Input()
  dataToTrack: any = {};

  @Input()
  trackOnlyClick = false;

  constructor(private el: ElementRef, private trackService: TrackService) {}

  @HostListener('click', ['$event'])
  clickEvent(event: any) {
    setTimeout(() => {
      this.dataToTrack.eventLabel = this.getEventLabel();
      this.trackService.trackEvent({
        eventAction: event.type,
        description: window.location.href,
        ...this.dataToTrack,
      });
    }, 0);
  }

  @HostListener('ionChange', ['$event'])
  changeEvent(event: any) {
    if (!this.trackOnlyClick) {
      const value = event && event.detail && event.detail.value;
      this.dataToTrack.eventLabel = this.getEventLabel();
      this.trackService.trackEvent({
        eventAction: 'click',
        description: `${window.location.href}. v:${value}`,
        ...this.dataToTrack,
      });
    }
  }

  private getEventLabel(): string {
    return this.dataToTrack.eventLabel || (this.el.nativeElement as HTMLElement).getAttribute('name');
  }
}
