import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NetworkSelectorModalComponent } from './components/network-selector-modal/network-selector-modal.component';
import { NetworkSelectorComponent } from './components/network-selector/network-selector.component';
import { WarrantySummaryCardComponent } from './components/warranty-summary-card/warranty-summary-card.component';

@NgModule({
  declarations: [ NetworkSelectorComponent, NetworkSelectorModalComponent, WarrantySummaryCardComponent],
  imports: [SharedModule],
  exports: [SharedModule,  NetworkSelectorComponent, NetworkSelectorModalComponent, WarrantySummaryCardComponent],
})
export class SharedContactsModule {}
