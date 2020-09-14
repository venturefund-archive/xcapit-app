import { NgModule } from '@angular/core';
import { TrackClickDirective } from './track-click.directive';

@NgModule({
  declarations: [
    TrackClickDirective,
  ],
  exports: [
    TrackClickDirective
  ]
})
export class TrackClickModule {}
