import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../users/shared-users/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'support',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'faqs',
        loadChildren: () => import('./faqs/faqs.module').then( m => m.FaqsPageModule)
      },
      {
        path: 'options',
        loadChildren: () =>
          import('../support/support-options/support-options.module').then((m) => m.SupportOptionsPageModule),
      },  
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportRoutingModule {}
