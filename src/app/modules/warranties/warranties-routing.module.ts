import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthNewGuard } from '../users/shared-users/guards/auth-new/auth-new.guard';

const routes: Routes = [
  {
    path: 'warranties',
    canActivate: [AuthNewGuard],
    children: [
      {
        path: 'send-warranty',
        loadChildren: () => import('./send-warranty/send-warranty.module').then((m) => m.SendWarrantyPageModule),
      },
      {
        path: 'warranty-summary',
        loadChildren: () =>
          import('./warranty-summary/warranty-summary.module').then((m) => m.WarrantySummaryPageModule),
      },
      {
        path: 'withdraw-warranty',
        loadChildren: () =>
          import('./withdraw-warranty/withdraw-warranty.module').then((m) => m.WithdrawWarrantyPageModule),
      },
      {
        path: 'withdraw-warranty-summary',
        loadChildren: () =>
          import('./withdraw-warranty-summary/withdraw-warranty-summary.module').then(
            (m) => m.WithdrawWarrantySummaryPageModule
          ),
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarrantiesRoutingModule {}
