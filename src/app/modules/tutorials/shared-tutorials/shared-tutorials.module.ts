import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { UxSlideStepShowComponent } from '../first-steps/ux-slide-step-show/ux-slide-step-show.component';

@NgModule({
  declarations: [
    UxSlideStepShowComponent
  ],
  imports: [SharedModule],
  entryComponents: [

  ],
  exports: [
    SharedModule,
    UxSlideStepShowComponent
  ]
})
export class SharedTutorialsModule {}
