import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FixedFooterComponent } from './components/fixed-footer/fixed-footer/fixed-footer.component';

@NgModule({
  declarations: [FixedFooterComponent],
  imports: [SharedModule],
  exports: [SharedModule, FixedFooterComponent],
})
export class SharedRampsModule {}
