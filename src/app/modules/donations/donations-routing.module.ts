import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'donations',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'information',
        loadChildren: () => import('./donations-info/donations-info.module').then(m => m.DonationsInfoPageModule)
      },
      {
        path: 'causes',
        loadChildren: () => import('./causes/causes.module').then( m => m.CausesPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationsRoutingModule { }
