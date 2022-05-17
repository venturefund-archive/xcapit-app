import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FixedFooterComponent } from './components/fixed-footer/fixed-footer/fixed-footer.component';
import { TransferConfirmCardComponent } from './components/transfer-confirm-card/transfer-confirm-card.component';

@NgModule({
  declarations: [FixedFooterComponent, TransferConfirmCardComponent],
  imports: [SharedModule],
  exports: [SharedModule, FixedFooterComponent, TransferConfirmCardComponent],
})
export class SharedRampsModule {}
