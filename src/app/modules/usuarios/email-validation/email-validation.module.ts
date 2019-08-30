import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailValidationPage } from './email-validation.page';
import { SharedUsuariosModule } from '../shared-usuarios/shared-usuarios.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/users/register' },
  {
    path: '',
    component: EmailValidationPage
  }
];

@NgModule({
  imports: [
    SharedUsuariosModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EmailValidationPage]
})
export class EmailValidationPageModule {}
