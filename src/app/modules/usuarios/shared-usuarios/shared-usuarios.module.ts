import { NgModule } from '@angular/core';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AuthFormComponent],
  imports: [
    SharedModule
  ],
  exports: [
    SharedModule,
    AuthFormComponent
  ]
})
export class SharedUsuariosModule { }
