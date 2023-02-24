import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { SharedUsersModule } from '../shared-users/shared-users.module';
import { NewLogin } from '../shared-users/guards/new-login/new-login.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
    canActivate: [NewLogin],
  },
];

@NgModule({
  imports: [SharedUsersModule, RouterModule.forChild(routes)],
  declarations: [LoginPage],
})
export class LoginPageModule {}
