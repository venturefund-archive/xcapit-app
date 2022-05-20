import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailValidationPage } from './email-validation.page';
import { SharedUsersModule } from '../shared-users/shared-users.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/users/register' },
  {
    path: ':emailValidationToken/:uidb64',
    component: EmailValidationPage
  }
];

@NgModule({
  imports: [
    SharedUsersModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EmailValidationPage]
})
export class EmailValidationPageModule {}
