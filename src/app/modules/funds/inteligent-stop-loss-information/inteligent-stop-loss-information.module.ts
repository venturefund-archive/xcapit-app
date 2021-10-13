import { NgModule } from '@angular/core';
import { InteligentStopLossInformationPage } from './inteligent-stop-loss-information.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: InteligentStopLossInformationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedFundsModule],
  declarations: [InteligentStopLossInformationPage],
  exports: [RouterModule],
})
export class InteligentStopLossInformationPageModule {}
