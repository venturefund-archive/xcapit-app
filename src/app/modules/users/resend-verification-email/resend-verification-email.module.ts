import { NgModule } from '@angular/core';
import { ResendVerificationEmailPage } from './resend-verification-email.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedUsersModule } from '../shared-users/shared-users.module';

const routes: Routes = [
  {
    path: ':email',
    component: ResendVerificationEmailPage,
  },
];

@NgModule({
  imports: [SharedUsersModule, RouterModule.forChild(routes)],
  declarations: [ResendVerificationEmailPage],
})
export class ResendVerificationEmailPageModule {}
