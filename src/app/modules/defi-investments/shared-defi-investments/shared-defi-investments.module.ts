import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DefiInvestmentProductComponent } from './components/defi-investment-product/defi-investment-product.component';

@NgModule({
  declarations: [DefiInvestmentProductComponent],
  imports: [SharedModule],
  exports: [SharedModule, DefiInvestmentProductComponent],
})
export class SharedDefiInvestmentsModule {}
