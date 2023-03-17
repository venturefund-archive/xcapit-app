import { NgModule } from '@angular/core';



import { UserBankAccountPage } from './user-bank-account.page';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: UserBankAccountPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [UserBankAccountPage],
})

export class UserBankAccountPageModule {}
