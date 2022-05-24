import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { MoonpayPage } from './moonpay.page';

const routes: Routes = [
  {
    path: '',
    component: MoonpayPage,
  },
  {
    path: ':asset',
    component: MoonpayPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [MoonpayPage],
})
export class MoonpayPageModule {}
