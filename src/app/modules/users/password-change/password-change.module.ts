import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordChangePage } from './password-change.page';
import { SharedUsersModule } from '../shared-users/shared-users.module';

const routes: Routes = [
  {
    path: '',
    component: PasswordChangePage
  }
];

@NgModule({
  imports: [
    SharedUsersModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PasswordChangePage]
})
export class PasswordChangePageModule {}
