import { NgModule } from '@angular/core';
import { HowCreateBinanceAccountPage } from './how-create-binance-account.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HowCreateBinanceAccountPage,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [HowCreateBinanceAccountPage],
})
export class HowCreateBinanceAccountPageModule {}
