import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAuthGuard } from './shared-usuarios/guards/no-auth/no-auth.guard';
import { AuthGuard } from './shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: 'register',
        canActivate: [NoAuthGuard],
        loadChildren: './register/register.module#RegisterPageModule'
      },
      {
        path: 'email-validation',
        canActivate: [NoAuthGuard],
        loadChildren:
          './email-validation/email-validation.module#EmailValidationPageModule'
      },
      {
        path: 'login',
        canActivate: [NoAuthGuard],
        loadChildren: './login/login.module#LoginPageModule'
      },
      {
        path: 'reset-password',
        canActivate: [NoAuthGuard],
        loadChildren:
          './reset-password/reset-password.module#ResetPasswordPageModule'
      },
      {
        path: 'password-change',
        canActivate: [AuthGuard],
        loadChildren:
          './password-change/password-change.module#PasswordChangePageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule {}
