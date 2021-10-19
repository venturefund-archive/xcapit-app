import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'support',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'options',
        loadChildren: () =>
          import('../support/support-options/support-options.module').then((m) => m.SupportOptionsPageModule),
      },
      {
        path: 'account',
        loadChildren: () => import('./support-account/support-account.module').then((m) => m.SupportAccountPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportRoutingModule {}
