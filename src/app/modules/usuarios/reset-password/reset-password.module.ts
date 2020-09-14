import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPasswordPage } from './reset-password.page';
import { SharedUsuariosModule } from '../shared-usuarios/shared-usuarios.module';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordPage
  },
  {
    path: ':resetPasswordToken/:uidb64',
    component: ResetPasswordPage
  }
];

@NgModule({
  imports: [
    SharedUsuariosModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ResetPasswordPage]
})
export class ResetPasswordPageModule {}
