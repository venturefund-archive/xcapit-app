import { NgModule } from '@angular/core';
import { SupportBinanceInvestmentsPage } from './support-binance-investments.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';

const routes: Routes = [
  {
    path: '',
    component: SupportBinanceInvestmentsPage,
  },
];

@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  declarations: [SupportBinanceInvestmentsPage],
})
export class SupportBinanceInvestmentsPageModule {}
