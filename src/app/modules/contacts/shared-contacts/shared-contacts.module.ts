import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NetworkSelectorModalComponent } from './components/network-selector-modal/network-selector-modal.component';
import { NetworkSelectorComponent } from './components/network-selector/network-selector.component';

@NgModule({
  declarations: [ NetworkSelectorComponent, NetworkSelectorModalComponent],
  imports: [SharedModule],
  exports: [SharedModule,  NetworkSelectorComponent, NetworkSelectorModalComponent],
})
export class SharedContactsModule {}
