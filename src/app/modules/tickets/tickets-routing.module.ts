import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAuthGuard } from '../users/shared-users/guards/no-auth/no-auth.guard';

const routes: Routes = [
  {
    path: 'tickets',
    children: [
      {
        path: 'create',
        canActivate: [NoAuthGuard],
        loadChildren: () =>
          import('./create-email-validation-ticket/create-email-validation-ticket.module').then(
            (m) => m.CreateEmailValidationTicketPageModule
          ),
      },
      {
        path: 'success',
        loadChildren: () =>
          import('./create-ticket-success/create-ticket-success.module').then((m) => m.CreateTicketSuccessPageModule),
      },
      {
        path: 'create-support-ticket',
        loadChildren: () =>
          import('./create-support-ticket/create-support-ticket.module').then((m) => m.CreateSupportTicketPageModule),
      },
      {
        path: 'new-create-support-ticket',
        loadChildren: () => import('./new-create-support-ticket/new-create-support-ticket.module').then( m => m.NewCreateSupportTicketPageModule)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule {}
