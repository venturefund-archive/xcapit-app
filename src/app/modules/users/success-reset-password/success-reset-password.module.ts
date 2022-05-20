import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuccessResetPasswordPage } from './success-reset-password.page';
import { SharedUsersModule } from '../shared-users/shared-users.module';

const routes: Routes = [
  {
    path: '',
    component: SuccessResetPasswordPage
  },
  {
    path: ':isReset',
    component: SuccessResetPasswordPage
  }
];

@NgModule({
  imports: [
    SharedUsersModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SuccessResetPasswordPage]
})
export class SuccessResetPasswordPageModule {}
