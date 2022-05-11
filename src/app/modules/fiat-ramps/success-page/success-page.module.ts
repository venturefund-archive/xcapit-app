import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuccessPagePage } from './success-page.page';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: SuccessPagePage
  }
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  exports: [SuccessPagePage],
  declarations: [SuccessPagePage],
})
export class SuccessPagePageModule {}
