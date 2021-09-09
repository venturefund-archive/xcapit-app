import { NgModule } from '@angular/core';
import { ExchangeInformationPage } from './exchange-information.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';

const routes: Routes = [
  {
    path: '',
    component: ExchangeInformationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [ExchangeInformationPage],
})
export class ExchangeInformationPageModule {}
