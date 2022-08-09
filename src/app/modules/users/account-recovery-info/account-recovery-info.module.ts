import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountRecoveryInfoPage } from './account-recovery-info.page';
import { SharedUsersModule } from '../shared-users/shared-users.module';

const routes: Routes = [
  {
    path: '',
    component: AccountRecoveryInfoPage
  }
];

@NgModule({
  imports: [ SharedUsersModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccountRecoveryInfoPage]
})
export class AccountRecoveryInfoPageModule {}
