import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserBankPage } from './user-bank.page';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: UserBankPage
  }
];

@NgModule({
  imports: [
    SharedRampsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserBankPage]
})
export class UserBankPageModule {}
