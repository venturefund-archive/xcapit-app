import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'terms-and-conditions',
    children: [
      {
        path: 'accept',
        canActivate: [AuthGuard],
        loadChildren: () => import('./accept/accept.module').then(m => m.AcceptPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsAndConditionsRoutingModule { }
