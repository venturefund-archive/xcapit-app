import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAuthGuard } from '../usuarios/shared-usuarios/guards/no-auth/no-auth.guard';

const routes: Routes = [
  {
    path: 'tickets',
    children: [
      {
        path: 'create-ticket',
        canActivate: [NoAuthGuard],
        loadChildren: () =>
          import('./create-ticket/create-ticket.module').then(
            (m) => m.CreateTicketPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule {}
