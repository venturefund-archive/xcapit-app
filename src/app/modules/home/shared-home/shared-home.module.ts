import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BuyCryptoCardComponent } from './components/buy-crypto-card/buy-crypto-card.component';
import { InformativeModalComponent } from './components/informative-modal/informative-modal.component';
import { FinancialPlannerCardComponent } from './components/financial-planner-card/financial-planner-card.component';

@NgModule({
  declarations: [BuyCryptoCardComponent, InformativeModalComponent, FinancialPlannerCardComponent],
  imports: [SharedModule],
  exports: [SharedModule, BuyCryptoCardComponent, InformativeModalComponent, FinancialPlannerCardComponent],
})
export class SharedHomeModule {}
