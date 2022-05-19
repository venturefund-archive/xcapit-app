import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuccessRegisterPage } from './success-register.page';
import { SharedUsersModule } from '../shared-users/shared-users.module';

const routes: Routes = [
  {
    path: '',
    component: SuccessRegisterPage
  }
];

@NgModule({
  imports: [
    SharedUsersModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SuccessRegisterPage]
})
export class SuccessRegisterPageModule {}
