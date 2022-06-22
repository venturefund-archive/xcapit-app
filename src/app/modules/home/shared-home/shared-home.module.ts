import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BuyCryptoCardComponent } from './components/buy-crypto-card/buy-crypto-card.component';
import { InformativeModalComponent } from './components/informative-modal/informative-modal.component';
import { FinancialPlannerCardComponent } from './components/financial-planner-card/financial-planner-card.component';
import { DonationsCardComponent } from './components/donations-card/donations-card.component';

@NgModule({
  declarations: [BuyCryptoCardComponent, InformativeModalComponent, FinancialPlannerCardComponent, DonationsCardComponent],
  imports: [SharedModule],
  exports: [SharedModule, BuyCryptoCardComponent, InformativeModalComponent, FinancialPlannerCardComponent, DonationsCardComponent,],
})
export class SharedHomeModule {}
