import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeSubheaderComponent } from './components/home-subheader/home-subheader.component';
import { WalletBalanceCardComponent } from './wallet-balance-card/wallet-balance-card/wallet-balance-card.component';

@NgModule({
  declarations: [HomeSubheaderComponent],
  imports: [SharedModule],
  exports: [SharedModule, HomeSubheaderComponent],
})
export class SharedHomeModule {}
