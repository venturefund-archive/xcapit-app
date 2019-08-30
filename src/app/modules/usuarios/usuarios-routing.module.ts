import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAuthGuard } from './shared-usuarios/guards/no-auth/no-auth.guard';

const routes: Routes = [
  {
    path: 'users',
    canActivate: [NoAuthGuard],
    children: [
      {
        path: 'register',
        loadChildren: './register/register.module#RegisterPageModule'
      },
      {
        path: 'email-validation/:emailValidationToken/:uidb64',
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
