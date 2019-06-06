import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: 'register',
        loadChildren: './register/register.module#RegisterPageModule'
      },
      {
        path: 'email-validation',
        loadChildren:
          './email-validation/email-validation.module#EmailValidationPageModule'
      },
      { path: 'login', loadChildren: './login/login.module#LoginPageModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule {}
