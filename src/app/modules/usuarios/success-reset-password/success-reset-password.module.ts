import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuccessResetPasswordPage } from './success-reset-password.page';
import { SharedUsuariosModule } from '../shared-usuarios/shared-usuarios.module';

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
    SharedUsuariosModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SuccessResetPasswordPage]
})
export class SuccessResetPasswordPageModule {}
