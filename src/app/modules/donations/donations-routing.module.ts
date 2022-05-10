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
      {
        path: 'description-cause',
        loadChildren: () => import('./description-cause/description-cause.module').then( m => m.DescriptionCausePageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationsRoutingModule { }
