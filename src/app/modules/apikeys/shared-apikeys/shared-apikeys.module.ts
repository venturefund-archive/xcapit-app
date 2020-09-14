import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [SharedModule],
  exports: [SharedModule]
})
export class SharedApikeysModule {}
