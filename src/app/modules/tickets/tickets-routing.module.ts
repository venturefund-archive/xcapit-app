import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAuthGuard } from '../usuarios/shared-usuarios/guards/no-auth/no-auth.guard';

const routes: Routes = [
  {
    path: 'tickets',
    children: [
      {
        path: 'create',
        canActivate: [NoAuthGuard],
        loadChildren: () => import('./create-ticket/create-ticket.module').then((m) => m.CreateTicketPageModule),
      },
      {
        path: 'create/success',
        loadChildren: () =>
          import('./create-ticket-success/create-ticket-success.module').then((m) => m.CreateTicketSuccessPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule {}
