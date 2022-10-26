import { NgModule } from '@angular/core';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';
import { PasswordChangeFormComponent } from './components/password-change-form/password-change-form.component';
import { LoginPasswordInfoComponent } from './components/login-password-info/login-password-info.component';
import { LoginBiometricActivationModalComponent } from './components/login-biometric-activation-modal/login-biometric-activation-modal.component';

@NgModule({
  declarations: [
    AuthFormComponent,
    ResetPasswordFormComponent,
    PasswordChangeFormComponent,
    LoginPasswordInfoComponent,
    LoginBiometricActivationModalComponent
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    AuthFormComponent,
    ResetPasswordFormComponent,
    PasswordChangeFormComponent,
    LoginPasswordInfoComponent,
    LoginBiometricActivationModalComponent
  ]
})
export class SharedUsersModule {}
