import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeSubheaderComponent } from './components/home-subheader/home-subheader.component';
import { BuyCryptoCardComponent } from './components/buy-crypto-card/buy-crypto-card.component';

@NgModule({
  declarations: [HomeSubheaderComponent, BuyCryptoCardComponent],
  imports: [SharedModule],
  exports: [SharedModule, HomeSubheaderComponent, BuyCryptoCardComponent],
})
export class SharedHomeModule {}
