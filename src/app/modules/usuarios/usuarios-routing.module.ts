import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'usuarios',
    children: [
      {
        path: 'register',
        loadChildren: './register/register.module#RegisterPageModule'
      },
      {
        path: 'email-validation',
        loadChildren:
          './email-validation/email-validation.module#EmailValidationPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule {}
