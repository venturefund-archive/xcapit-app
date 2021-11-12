import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { StepComponent } from './components/step/step.component';

@NgModule({
  declarations: [StepComponent],
  imports: [SharedModule],
  entryComponents: [],
  exports: [SharedModule, StepComponent],
})
export class SharedTutorialsModule {}
