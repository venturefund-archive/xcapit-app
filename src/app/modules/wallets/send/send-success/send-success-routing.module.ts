import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendSuccessPage } from './send-success.page';

const routes: Routes = [
  {
    path: '',
    component: SendSuccessPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendSuccessPageRoutingModule {}
