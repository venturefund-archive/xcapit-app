import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcceptPage } from './accept.page';
import { SharedTermsAndConditionsModule } from '../shared-terms-and-conditions/shared-terms-and-conditions.module';

const routes: Routes = [
  {
    path: '',
    component: AcceptPage
  }
];

@NgModule({
  imports: [
    SharedTermsAndConditionsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AcceptPage]
})
export class AcceptPageModule {}
