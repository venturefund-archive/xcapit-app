import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordChangePage } from './password-change.page';
import { SharedUsuariosModule } from '../shared-usuarios/shared-usuarios.module';

const routes: Routes = [
  {
    path: '',
    component: PasswordChangePage
  }
];

@NgModule({
  imports: [
    SharedUsuariosModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PasswordChangePage]
})
export class PasswordChangePageModule {}
