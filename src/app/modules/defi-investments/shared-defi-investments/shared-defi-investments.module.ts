import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComingSoonInvestmentsComponent } from './components/coming-soon-investments/coming-soon-investments.component';
import { DefiInvestmentProductComponent } from './components/defi-investment-product/defi-investment-product.component';

@NgModule({
  declarations: [DefiInvestmentProductComponent, ComingSoonInvestmentsComponent],
  imports: [SharedModule],
  exports: [SharedModule, DefiInvestmentProductComponent, ComingSoonInvestmentsComponent],
})
export class SharedDefiInvestmentsModule {}
