import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared-users/guards/auth/auth.guard';
import { NoAuthGuard } from './shared-users/guards/no-auth/no-auth.guard';

const routes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: 'on-boarding',
        canActivate: [NoAuthGuard],
        loadChildren: () => import('./on-boarding/on-boarding.module').then((m) => m.OnBoardingPageModule),
      },
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
        canActivate: [NoAuthGuard],
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
      {
        path: 'login-new',
        canActivate: [NoAuthGuard],
        loadChildren: () => import('./login-new/login-new.module').then((m) => m.LoginNewPageModule),
      },
      {
        path: 'account-recovery',
        canActivate: [NoAuthGuard],
        loadChildren: () =>
          import('./account-recovery/account-recovery.module').then((m) => m.AccountRecoveryPageModule),
      },
      {
        path: 'recovery-info',
        canActivate: [NoAuthGuard],
        loadChildren: () =>
          import('./account-recovery-info/account-recovery-info.module').then((m) => m.AccountRecoveryInfoPageModule),
      },
      {
        path: 'terms-and-conditions',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./terms-and-conditions/terms-and-conditions.module').then((m) => m.TermsAndConditionsPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
