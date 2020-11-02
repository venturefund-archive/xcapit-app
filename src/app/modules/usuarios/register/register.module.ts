import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPage } from './register.page';
import { SharedUsuariosModule } from '../shared-usuarios/shared-usuarios.module';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  },
  {
    path: ':code',
    component: RegisterPage
  },
  {
    path: ':code/:email',
    component: RegisterPage
  }
];

@NgModule({
  imports: [
    SharedUsuariosModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
