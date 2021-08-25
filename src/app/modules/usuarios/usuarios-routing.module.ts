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
        loadChildren: () => import('./register/register.module').then((m) => m.RegisterPageModule),
      },
      {
        path: 'email-validation',
        canActivate: [NoAuthGuard],
        loadChildren: () =>
          import('./email-validation/email-validation.module').then((m) => m.EmailValidationPageModule),
      },
      {
        path: 'login',
        canActivate: [NoAuthGuard],
        loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule),
      },
      {
        path: 'reset-password',
        canActivate: [NoAuthGuard],
        loadChildren: () => import('./reset-password/reset-password.module').then((m) => m.ResetPasswordPageModule),
      },
      {
        path: 'success-reset',
        canActivate: [NoAuthGuard],
        loadChildren: () =>
          import('./success-reset-password/success-reset-password.module').then(
            (m) => m.SuccessResetPasswordPageModule
          ),
      },
      {
        path: 'success-register',
        canActivate: [NoAuthGuard],
        loadChildren: () =>
          import('./success-register/success-register.module').then((m) => m.SuccessRegisterPageModule),
      },
      {
        path: 'resend-verification-email',
        // canActivate: [NoAuthGuard],
        loadChildren: () =>
          import('./resend-verification-email/resend-verification-email.module').then(
            (m) => m.ResendVerificationEmailPageModule
          ),
      },
      {
        path: 'password-change',
        canActivate: [AuthGuard],
        loadChildren: () => import('./password-change/password-change.module').then((m) => m.PasswordChangePageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRoutingModule {}
