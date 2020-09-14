import { NgModule } from '@angular/core';
import { TrackClickUnauthDirective } from './track-click-unauth.directive';

@NgModule({
  declarations: [
    TrackClickUnauthDirective
  ],
  exports: [
    TrackClickUnauthDirective
  ]
})
export class TrackClickUnauthModule {}
