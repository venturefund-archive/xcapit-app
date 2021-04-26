import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserBankPage } from './user-bank.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: UserBankPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserBankPage]
})
export class UserBankPageModule {}
