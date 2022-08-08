import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountRecoveryPage } from './account-recovery.page';
import { SharedUsersModule } from '../shared-users/shared-users.module';

const routes: Routes = [
  {
    path: '',
    component: AccountRecoveryPage
  }
];
@NgModule({
  imports: [
    SharedUsersModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccountRecoveryPage]
})
export class AccountRecoveryPageModule {}
