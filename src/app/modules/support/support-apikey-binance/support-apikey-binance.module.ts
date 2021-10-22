import { NgModule } from '@angular/core';
import { SupportApikeyBinancePage } from './support-apikey-binance.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';

const routes: Routes = [
  {
    path: '',
    component: SupportApikeyBinancePage,
  },
];
@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [SupportApikeyBinancePage],
})
export class SupportApikeyBinancePageModule {}
