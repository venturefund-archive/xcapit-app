import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthNewGuard } from './shared-users/guards/auth-new/auth-new.guard';
import { NoAuthNewGuard } from './shared-users/guards/no-auth-new/no-auth-new.guard';

const routes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: 'on-boarding',
        canActivate: [NoAuthNewGuard],
        loadChildren: () => import('./on-boarding/on-boarding.module').then((m) => m.OnBoardingPageModule),
      },
      {
        path: 'register',
        canActivate: [NoAuthNewGuard],
        loadChildren: () => import('./register/register.module').then((m) => m.RegisterPageModule),
      },
      {
        path: 'email-validation',
        canActivate: [NoAuthNewGuard],
        loadChildren: () =>
          import('./email-validation/email-validation.module').then((m) => m.EmailValidationPageModule),
      },
      {
        path: 'login',
        canActivate: [NoAuthNewGuard],
        loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule),
      },
      {
        path: 'reset-password',
        canActivate: [NoAuthNewGuard],
        loadChildren: () => import('./reset-password/reset-password.module').then((m) => m.ResetPasswordPageModule),
      },
      {
        path: 'success-reset',
        canActivate: [NoAuthNewGuard],
        loadChildren: () =>
          import('./success-reset-password/success-reset-password.module').then(
            (m) => m.SuccessResetPasswordPageModule
          ),
      },
      {
        path: 'success-register',
        canActivate: [NoAuthNewGuard],
        loadChildren: () =>
          import('./success-register/success-register.module').then((m) => m.SuccessRegisterPageModule),
      },
      {
        path: 'resend-verification-email',
        canActivate: [NoAuthNewGuard],
        loadChildren: () =>
          import('./resend-verification-email/resend-verification-email.module').then(
            (m) => m.ResendVerificationEmailPageModule
          ),
      },
      {
        path: 'password-change',
        canActivate: [AuthNewGuard],
        loadChildren: () => import('./password-change/password-change.module').then((m) => m.PasswordChangePageModule),
      },
      {
        path: 'login-new',
        canActivate: [NoAuthNewGuard],
        loadChildren: () => import('./login-new/login-new.module').then((m) => m.LoginNewPageModule),
      },
      {
        path: 'account-recovery',
        canActivate: [NoAuthNewGuard],
        loadChildren: () =>
          import('./account-recovery/account-recovery.module').then((m) => m.AccountRecoveryPageModule),
      },
      {
        path: 'recovery-info',
        canActivate: [NoAuthNewGuard],
        loadChildren: () =>
          import('./account-recovery-info/account-recovery-info.module').then((m) => m.AccountRecoveryInfoPageModule),
      },
      {
        path: 'terms-and-conditions',
        canActivate: [AuthNewGuard],
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
