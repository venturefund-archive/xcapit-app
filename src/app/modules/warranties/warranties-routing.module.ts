import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../users/shared-users/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'warranties',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'send-warranty',
        loadChildren: () => import('./send-warranty/send-warranty.module').then((m) => m.SendWarrantyPageModule),
      },
      {
        path: 'withdraw-warranty',
        loadChildren: () => import('./withdraw-warranty/withdraw-warranty.module').then( m => m.WithdrawWarrantyPageModule)
      },
      {
        path: 'warranty-summary',
        loadChildren: () => import('./warranty-summary/warranty-summary.module').then( m => m.WarrantySummaryPageModule)
      }
    ],
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarrantiesRoutingModule {}
