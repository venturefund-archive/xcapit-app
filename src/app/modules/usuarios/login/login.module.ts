import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { SharedUsuariosModule } from '../shared-usuarios/shared-usuarios.module';
import { UxHeaderLoginComponent } from './ux-header-login/ux-header-login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [SharedUsuariosModule, RouterModule.forChild(routes)],
  declarations: [LoginPage, UxHeaderLoginComponent]
})
export class LoginPageModule {}
