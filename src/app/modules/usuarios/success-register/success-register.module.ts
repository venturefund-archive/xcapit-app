import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuccessRegisterPage } from './success-register.page';
import { SharedUsuariosModule } from '../shared-usuarios/shared-usuarios.module';

const routes: Routes = [
  {
    path: '',
    component: SuccessRegisterPage
  }
];

@NgModule({
  imports: [
    SharedUsuariosModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SuccessRegisterPage]
})
export class SuccessRegisterPageModule {}
