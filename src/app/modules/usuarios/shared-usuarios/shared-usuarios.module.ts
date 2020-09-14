import { NgModule } from '@angular/core';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';
import { PasswordChangeFormComponent } from './components/password-change-form/password-change-form.component';

@NgModule({
  declarations: [
    AuthFormComponent,
    ResetPasswordFormComponent,
    PasswordChangeFormComponent
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    AuthFormComponent,
    ResetPasswordFormComponent,
    PasswordChangeFormComponent
  ]
})
export class SharedUsuariosModule {}
