import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BuyCryptoCardComponent } from './components/buy-crypto-card/buy-crypto-card.component';
import { InformativeModalComponent } from './components/informative-modal/informative-modal.component';

@NgModule({
  declarations: [BuyCryptoCardComponent, InformativeModalComponent],
  imports: [SharedModule],
  exports: [SharedModule, BuyCryptoCardComponent, InformativeModalComponent],
})
export class SharedHomeModule {}
