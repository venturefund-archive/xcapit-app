import { NgModule } from '@angular/core';
import { ApikeyInformationPage } from './apikey-information.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';

const routes: Routes = [
  {
    path: '',
    component: ApikeyInformationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [ApikeyInformationPage],
})
export class ApikeyInformationPageModule {}
