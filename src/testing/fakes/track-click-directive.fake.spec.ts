import { Directive, HostListener, Input } from '@angular/core';
import { TrackService } from '../../app/shared/services/track/track.service';
import { ITrackClickDirective } from '../../app/shared/directives/track-click/track-click.interface';

@Directive({
  selector: '[appTrackClick]',
  providers: [{ provide: TrackService, useValue: { trackEvent: () => null } }],
})
export class FakeTrackClickDirective implements ITrackClickDirective {
  @Input() dataToTrack: any;
  @Input() trackOnlyClick: boolean;

  constructor() {}

  @HostListener('ionChange', ['$event']) changeEvent(event: any): void {}
  @HostListener('click', ['$event']) clickEvent(event: any): void {}
}
