import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'referrals',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'list',
        loadChildren: () =>
          import('./referrals-list/referrals-list.module').then(
            (m) => m.ReferralsListPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferralsRoutingModule {}
