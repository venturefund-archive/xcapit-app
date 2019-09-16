import { NgModule } from '@angular/core';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';

@NgModule({
  declarations: [AuthFormComponent, ResetPasswordFormComponent],
  imports: [
    SharedModule
  ],
  exports: [
    SharedModule,
    AuthFormComponent,
    ResetPasswordFormComponent
  ]
})
export class SharedUsuariosModule { }
