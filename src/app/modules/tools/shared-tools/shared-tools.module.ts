import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToolsCardComponent } from './components/tools-card/tools-card.component';

@NgModule({
  declarations: [ToolsCardComponent],
  imports: [SharedModule],
  exports: [SharedModule, ToolsCardComponent],
})
export class SharedToolsModule {}
