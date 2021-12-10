import { NgModule } from '@angular/core';
import { ResendVerificationEmailPage } from './resend-verification-email.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedUsuariosModule } from '../shared-usuarios/shared-usuarios.module';

const routes: Routes = [
  {
    path: ':email',
    component: ResendVerificationEmailPage,
  },
];

@NgModule({
  imports: [SharedUsuariosModule, RouterModule.forChild(routes)],
  declarations: [ResendVerificationEmailPage],
})
export class ResendVerificationEmailPageModule {}
